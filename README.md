# Pattern-Trainer Agent 🎯

An AI-powered web tool that helps users practice algorithm/LeetCode-style problems, adaptively focusing on weak patterns using Gemini AI and agent-based architecture.

## Features

- **AI-Generated Challenges**: Dynamic problem generation using Google Gemini
- **Smart Feedback**: Code evaluation with complexity analysis and suggestions
- **Adaptive Learning**: Tracks weak patterns and recommends focused practice
- **Agent Architecture**: Credit-based problem generation tracking (Fetch.ai inspired)
- **Multiple Patterns**: Supports various algorithmic patterns (sliding window, two pointers, dynamic programming, etc.)

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

3. **Run the Server**
```bash
npm start
```

4. **Open Browser**
Navigate to `http://localhost:3000`

## Architecture

- **Frontend**: Vanilla JS with CodeMirror editor
- **Backend**: Express.js REST API
- **AI Engine**: Google Gemini API
- **Agent Layer**: Credit tracking system for problem generation
- **Memory Store**: In-memory user profile tracking

## API Endpoints

### POST /request_challenge
Request a new coding challenge
```json
{
  "user_id": "user123",
  "pattern": "sliding_window",
  "difficulty": "medium"
}
```

### POST /submit_solution
Submit solution for evaluation
```json
{
  "user_id": "user123",
  "pattern": "sliding_window",
  "code": "def maxSubArray(nums): ..."
}
```

### GET /user_profile/:user_id
Get user statistics and weak patterns

## Supported Patterns

- Sliding Window
- Two Pointers
- Binary Search
- Dynamic Programming
- Graph BFS/DFS
- Backtracking
- Greedy
- And more...

## Technologies

- Node.js + Express
- Google Gemini API
- Fetch.ai Agent Architecture (credit system)
- CodeMirror (code editor)
- Vanilla JavaScript

## License

MIT
