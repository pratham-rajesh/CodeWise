const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('WARNING: GEMINI_API_KEY not set. AI features will not work.');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    }

    // Load Blind 75 problems for reference
    this.blind75Problems = this.loadBlind75();
  }

  loadBlind75() {
    try {
      const dataPath = path.join(__dirname, '../data/blind75.json');
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`✅ Loaded ${data.length} Blind 75 problems for Gemini context`);
        return data;
      }
    } catch (error) {
      console.warn('⚠️  Could not load Blind 75 data:', error.message);
    }
    return [];
  }

  getExamplesByPattern(pattern, limit = 3) {
    if (!this.blind75Problems || this.blind75Problems.length === 0) {
      return [];
    }

    // Filter problems by pattern and return a subset
    return this.blind75Problems
      .filter(p => p.pattern === pattern && p.description)
      .slice(0, limit);
  }

  async generateProblem(pattern, difficulty = 'medium', blind75Examples = []) {
    if (!this.genAI) {
      return this.getMockProblem(pattern, difficulty);
    }

    try {
      // Auto-load examples if not provided
      if (!blind75Examples || blind75Examples.length === 0) {
        blind75Examples = this.getExamplesByPattern(pattern, 3);
      }

      // Build context from Blind 75 examples if available
      let contextSection = '';
      if (blind75Examples && blind75Examples.length > 0) {
        contextSection = `\n\n**Reference Problems (Blind 75 LeetCode problems for inspiration):**
${blind75Examples.map((p, idx) => `
${idx + 1}. ${p.title} (${p.difficulty})
   Pattern: ${p.pattern}
   Description: ${p.description.substring(0, 200)}...
   LeetCode: ${p.leetcodeUrl}
`).join('\n')}

Use these as inspiration to create a SIMILAR but UNIQUE problem that tests the same pattern and skills.
Do NOT copy these problems directly - create a new, original problem inspired by their style and complexity.`;
      }

      const prompt = `Generate a LeetCode-style coding problem for the algorithmic pattern: "${pattern}".
${contextSection}

Requirements:
- Difficulty level: ${difficulty}
- The problem should clearly demonstrate the ${pattern} pattern
- Include a clear problem description with examples
- Provide 3-4 test cases (input/expected output pairs)
- Make it practical and realistic
- If reference problems are provided, match their style and complexity but create something NEW

Format your response as JSON with this structure:
{
  "title": "Problem Title",
  "description": "Detailed problem description",
  "examples": [
    {
      "input": "example input",
      "output": "expected output",
      "explanation": "why this output"
    }
  ],
  "test_cases": [
    {
      "input": "test input",
      "expected_output": "expected output"
    }
  ],
  "constraints": ["constraint 1", "constraint 2"],
  "hints": ["hint 1", "hint 2"]
}

Generate a unique, interesting problem now:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const problemData = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          problem: {
            title: problemData.title,
            description: problemData.description,
            examples: problemData.examples || [],
            test_cases: problemData.test_cases || [],
            constraints: problemData.constraints || [],
            hints: problemData.hints || [],
            pattern,
            difficulty
          }
        };
      } else {
        throw new Error('Invalid JSON response from Gemini');
      }
    } catch (error) {
      console.error('Error generating problem with Gemini:', error);
      return {
        success: false,
        error: error.message,
        problem: this.getMockProblem(pattern, difficulty)
      };
    }
  }

  async evaluateCode(code, pattern, problemDescription) {
    if (!this.genAI) {
      return this.getMockEvaluation();
    }

    try {
      const prompt = `Evaluate this code submission for a ${pattern} pattern problem.

Problem Context: ${problemDescription}

Code Submitted:
\`\`\`
${code}
\`\`\`

Analyze the code and provide feedback in JSON format:
{
  "correct": true/false,
  "errors": ["list of errors or issues found"],
  "complexity": {
    "time": "O(n) explanation",
    "space": "O(1) explanation"
  },
  "suggestions": ["improvement 1", "improvement 2"],
  "pattern_usage": "How well does this use the ${pattern} pattern?",
  "code_quality": "Assessment of code quality, readability, edge cases",
  "score": 0-100
}

Provide detailed, constructive feedback:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const evaluation = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          evaluation: {
            correct: evaluation.correct || false,
            errors: evaluation.errors || [],
            complexity: evaluation.complexity || { time: 'Unknown', space: 'Unknown' },
            suggestions: evaluation.suggestions || [],
            pattern_usage: evaluation.pattern_usage || 'Not assessed',
            code_quality: evaluation.code_quality || 'Not assessed',
            score: evaluation.score || 0
          }
        };
      } else {
        throw new Error('Invalid JSON response from Gemini');
      }
    } catch (error) {
      console.error('Error evaluating code with Gemini:', error);
      return {
        success: false,
        error: error.message,
        evaluation: this.getMockEvaluation()
      };
    }
  }

  getMockProblem(pattern, difficulty) {
    const mockProblems = {
      sliding_window: {
        title: "Maximum Sum Subarray of Size K",
        description: "Given an array of integers and a number k, find the maximum sum of a subarray of size k.",
        examples: [
          {
            input: "arr = [2, 1, 5, 1, 3, 2], k = 3",
            output: "9",
            explanation: "Subarray [5, 1, 3] has the maximum sum of 9"
          }
        ],
        test_cases: [
          { input: "[2, 1, 5, 1, 3, 2], k = 3", expected_output: "9" },
          { input: "[1, 4, 2, 10, 23, 3, 1, 0, 20], k = 4", expected_output: "39" },
          { input: "[100, 200, 300, 400], k = 2", expected_output: "700" }
        ],
        constraints: ["1 <= arr.length <= 10^5", "1 <= k <= arr.length"],
        hints: ["Use a sliding window to track the sum", "Slide the window by removing first element and adding next"]
      },
      two_pointers: {
        title: "Two Sum II - Sorted Array",
        description: "Given a sorted array, find two numbers that add up to a target value. Return their indices.",
        examples: [
          {
            input: "arr = [2, 7, 11, 15], target = 9",
            output: "[0, 1]",
            explanation: "2 + 7 = 9"
          }
        ],
        test_cases: [
          { input: "[2, 7, 11, 15], target = 9", expected_output: "[0, 1]" },
          { input: "[1, 2, 3, 4, 6], target = 6", expected_output: "[1, 3]" }
        ],
        constraints: ["Array is sorted", "Exactly one solution exists"],
        hints: ["Use two pointers from start and end", "Move pointers based on sum comparison"]
      }
    };

    return mockProblems[pattern] || mockProblems.sliding_window;
  }

  getMockEvaluation() {
    return {
      correct: true,
      errors: [],
      complexity: {
        time: "O(n)",
        space: "O(1)"
      },
      suggestions: ["Consider edge cases", "Add input validation"],
      pattern_usage: "Good use of the pattern",
      code_quality: "Code is readable and efficient",
      score: 85
    };
  }

  async analyzeNoteImage(imageBase64, problemTitle, problemDescription, pattern, difficulty) {
    if (!this.genAI) {
      return {
        success: false,
        error: 'Gemini API not configured'
      };
    }

    try {
      // Use vision model for image analysis
      const visionModel = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

      const prompt = `You are a helpful coding mentor analyzing a student's handwritten notes or diagram for solving a coding problem.

**Problem Context:**
Title: ${problemTitle}
Pattern: ${pattern}
Difficulty: ${difficulty}
Description: ${problemDescription}

**Your Task:**
Analyze the uploaded image (handwritten notes, diagrams, or problem-solving approach) and provide:
1. A brief analysis of what approach/thinking you see in the notes
2. 3-5 helpful hints or nudges that guide them in the right direction WITHOUT revealing the complete solution
3. An encouraging message

**Important Guidelines:**
- DO NOT provide the complete solution or full code
- Give hints that help them think through the problem
- Point out if they're on the right track or suggest alternative approaches
- Be encouraging and supportive
- If the image is unclear or unrelated, politely ask for a clearer image

Format your response as JSON:
{
  "analysis": "Brief analysis of their approach from the notes",
  "hints": ["hint 1", "hint 2", "hint 3"],
  "encouragement": "Encouraging message"
}`;

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg'
        }
      };

      const result = await visionModel.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          analysis: analysisData.analysis || 'Unable to analyze notes',
          hints: analysisData.hints || [],
          encouragement: analysisData.encouragement || 'Keep up the great work!'
        };
      } else {
        throw new Error('Invalid JSON response from Gemini Vision');
      }
    } catch (error) {
      console.error('Error analyzing note image with Gemini Vision:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new GeminiService();
