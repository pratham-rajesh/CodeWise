const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Fetch problem details from LeetCode GraphQL API
 */
async function fetchProblemDetails(titleSlug) {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        titleSlug
        content
        difficulty
        exampleTestcases
        topicTags {
          name
          slug
        }
        hints
        sampleTestCase
      }
    }
  `;

  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { titleSlug }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    return response.data.data.question;
  } catch (error) {
    console.error(`  ❌ Error fetching ${titleSlug}:`, error.message);
    return null;
  }
}

/**
 * Delay between requests to respect rate limits
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main function to fetch all Blind 75 problems
 */
async function fetchBlind75() {
  const slugsPath = path.join(__dirname, '../data/blind75-slugs.json');
  const outputPath = path.join(__dirname, '../data/blind75.json');

  console.log('📥 Loading problem slugs...');

  if (!fs.existsSync(slugsPath)) {
    console.error('❌ blind75-slugs.json not found. Run parseExcel.js first.');
    process.exit(1);
  }

  const problems = JSON.parse(fs.readFileSync(slugsPath, 'utf8'));
  console.log(`✅ Found ${problems.length} problems to fetch`);

  const enrichedProblems = [];
  let successCount = 0;
  let failCount = 0;

  console.log('\n🌐 Fetching from LeetCode GraphQL API...');
  console.log('(This will take about 2-3 minutes with rate limiting)\n');

  for (let i = 0; i < problems.length; i++) {
    const problem = problems[i];
    console.log(`[${i + 1}/${problems.length}] Fetching: ${problem.title}`);

    const details = await fetchProblemDetails(problem.titleSlug);

    if (details) {
      enrichedProblems.push({
        ...problem,
        problemId: details.questionId,
        description: details.content,
        difficulty: details.difficulty,
        hints: details.hints || [],
        topicTags: (details.topicTags || []).map(tag => tag.name),
        exampleTestcases: details.exampleTestcases || '',
        sampleTestCase: details.sampleTestCase || ''
      });
      successCount++;
      console.log(`  ✅ Success`);
    } else {
      // Keep the problem but mark as incomplete
      enrichedProblems.push({
        ...problem,
        problemId: null,
        description: 'Failed to fetch',
        hints: [],
        topicTags: []
      });
      failCount++;
    }

    // Rate limiting: 1.5 second delay between requests
    if (i < problems.length - 1) {
      await delay(1500);
    }
  }

  console.log(`\n📊 Fetch complete:`);
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);

  // Save enriched data
  fs.writeFileSync(outputPath, JSON.stringify(enrichedProblems, null, 2));
  console.log(`\n💾 Saved to: ${outputPath}`);

  return enrichedProblems;
}

// Run if executed directly
if (require.main === module) {
  fetchBlind75().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = fetchBlind75;
