const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Parse Blind 75 Excel file and extract problem information
 */
function parseExcel() {
  const excelPath = '/Users/prathamr/Downloads/Leetcode 75 Questions (NeetCode on yt).xlsx';
  const outputPath = path.join(__dirname, '../data/blind75-slugs.json');

  console.log('📊 Reading Excel file...');

  try {
    // Read the Excel file
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON with headers - row 2 has headers, data starts at row 3
    const data = XLSX.utils.sheet_to_json(worksheet, { range: 2 });

    console.log(`✅ Found ${data.length} problems in Excel`);

    // Extract and process problem information
    const problems = data.map((row, index) => {
      // Extract LeetCode URL and get the slug
      let url = row['Link'] || row['URL'] || row['LeetCode Link'] || '';
      let slug = '';

      if (url && typeof url === 'string') {
        // Extract slug from URL (e.g., https://leetcode.com/problems/two-sum/ -> two-sum)
        const match = url.match(/leetcode\.com\/problems\/([^\/]+)/);
        if (match) {
          slug = match[1];
        }
      }

      // Extract other fields
      const title = row['Name'] || row['Title'] || row['Problem'] || '';
      const pattern = row['Category'] || row['Pattern'] || row['Type'] || '';
      const videoUrl = row['Video Solution'] || '';
      const notes = row['Notes'] || '';

      return {
        order: index + 1,
        title: title.toString().trim(),
        titleSlug: slug,
        pattern: pattern.toString().trim().toLowerCase().replace(/\s+/g, '_'),
        difficulty: 'Medium', // Will get from LeetCode API
        leetcodeUrl: url.toString().trim(),
        videoUrl: videoUrl.toString().trim(),
        notes: notes.toString().trim()
      };
    }).filter(p => p.titleSlug); // Only include problems with valid slugs

    console.log(`✅ Extracted ${problems.length} valid problems with URLs`);

    // Show sample data
    console.log('\n📋 Sample problems:');
    problems.slice(0, 3).forEach(p => {
      console.log(`  ${p.order}. ${p.title} (${p.pattern}) - ${p.titleSlug}`);
    });

    // Save to JSON file
    fs.writeFileSync(outputPath, JSON.stringify(problems, null, 2));
    console.log(`\n💾 Saved to: ${outputPath}`);

    return problems;
  } catch (error) {
    console.error('❌ Error parsing Excel:', error.message);
    process.exit(1);
  }
}

// Run the parser
if (require.main === module) {
  parseExcel();
}

module.exports = parseExcel;
