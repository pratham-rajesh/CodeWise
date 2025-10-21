# Code Wise 🎯

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)](https://tailwindcss.com/)

> **A smart way to prepare for technical interviews** - Master coding interview patterns through AI-powered problem generation, multimodal feedback, and voice explanation practice.

## Overview

Code Wise is an intelligent coding interview preparation platform that combines AI-powered problem generation with comprehensive feedback systems. Whether you're preparing for FAANG interviews or startup technical rounds, Code Wise adapts to your learning style and provides personalized practice experiences.

### Who is it for?
- **Job seekers** preparing for technical interviews
- **Students** learning algorithmic problem-solving
- **Developers** wanting to practice coding patterns
- **Anyone** looking to improve their coding interview skills

## 🌟 Features

### 🤖 **AI-Powered Learning**
- **Google Gemini 2.5 Pro** integration for dynamic problem generation and evaluation
- **Intelligent Code Evaluation** with detailed feedback and scoring (0-100 scale)
- **Adaptive Learning** that tracks weak patterns and provides personalized recommendations
- **Image Hint System** - Upload handwritten notes for AI analysis and hints
- **Voice Explanation Practice** - Record and get AI-evaluated feedback on your verbal explanations

### 🎙️ **Voice Interview Simulation**
- **Record Your Explanations** - Practice explaining solutions as if you're in a real interview
- **AI Transcript Generation** - Automatic transcription of your verbal explanations
- **Comprehensive Evaluation** - Get scored on 6 key criteria:
  - **Clarity** (0-20 points) - How clearly you articulate your thoughts
  - **Problem Understanding** (0-20 points) - Grasp of requirements and constraints
  - **Approach Explanation** (0-20 points) - Quality of algorithm explanation
  - **Complexity Analysis** (0-20 points) - Discussion of time and space complexity
  - **Edge Cases** (0-10 points) - Mention of important edge cases
  - **Communication** (0-10 points) - Overall professionalism and structure
- **Personalized Feedback** - Strengths and suggestions for improvement
- **Interview Ready** - Build confidence in verbal communication skills

### 📚 **Comprehensive Problem Sets**
- **AI-Generated Challenges** for 10+ algorithmic patterns
- **Blind 75 Integration** - Complete curated list of most important LeetCode problems
- **Difficulty Progression** - Easy, Medium, Hard problems with adaptive recommendations
- **Pattern-Specific Practice** - Focus on specific algorithms you need to improve

### 🎨 **Modern User Experience**
- **Notion-Inspired Design** - Clean, minimalist interface with smooth animations
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Progress Tracking** - Visual progress indicators and statistics
- **Interactive Code Editor** - Built-in editor with syntax highlighting

### 🏗️ **Robust Architecture**
- **Multimodal AI** - Text, image, and audio processing capabilities
- **Dual Storage** - MongoDB with in-memory fallback for reliability
- **RESTful API** - Well-documented endpoints for all functionality
- **TypeScript** - Full type safety across frontend and backend

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5.9** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

### Backend
- **Express.js** - Node.js web framework
- **Google Gemini AI** - AI problem generation and multimodal evaluation
  - Gemini 2.5 Pro for text and vision
  - Gemini 1.5 Pro for audio processing
- **MongoDB** - Optional persistent storage
- **Mongoose** - MongoDB object modeling

### AI Capabilities
- **Text Generation** - Dynamic problem creation and code evaluation
- **Vision AI** - Handwritten note analysis and hint generation
- **Audio AI** - Voice explanation transcription and evaluation
- **Intelligent Prompting** - Prevents AI hallucination and ensures accurate evaluations

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+
- **npm** or **yarn**
- **MongoDB** (optional - falls back to in-memory storage)
- **Google Gemini API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pratham-rajesh/CodeWise.git
   cd CodeWise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   USE_MONGODB=true
   MONGODB_URI=mongodb://localhost:27017/codewise
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3001`

## 📖 Usage

### Basic Workflow

1. **Generate a Problem** - Select a pattern and difficulty level
2. **Solve the Challenge** - Use the built-in code editor
3. **Submit Your Solution** - Get instant AI feedback and scoring
4. **Review Feedback** - Understand your strengths and areas for improvement
5. **Track Progress** - Monitor your improvement across different patterns
6. **Get AI Feedback** - Receive detailed evaluation with suggestions and scoring

### Voice Explanation Practice

1. **Get a Problem** - First generate or select a coding challenge
2. **Record Your Explanation** - Click "Start Recording" and explain your solution approach
   - Describe your understanding of the problem
   - Walk through your solution algorithm
   - Discuss time and space complexity
   - Mention edge cases and trade-offs
3. **Review Recording** - Listen to your recording before submitting
4. **Get AI Evaluation** - Receive comprehensive feedback including:
   - Overall score out of 100
   - Detailed breakdown by evaluation criteria
   - Transcript of what you said
   - Strengths you demonstrated
   - Suggestions for improvement
5. **Iterate and Improve** - Practice multiple times to build confidence

### Blind 75 Practice

1. **Navigate to Blind 75** - Access the curated list of most important interview problems
2. **Select a Problem** - Choose from the comprehensive list
3. **Practice and Track** - Mark problems as completed and track your progress
4. **Review Statistics** - See your completion rate and time spent

### Advanced Features

- **Image Hints** - Upload handwritten notes or diagrams for AI analysis and personalized hints
- **Weak Pattern Detection** - Get personalized recommendations based on submission history
- **Progress Analytics** - Detailed statistics on your coding journey

## 🏗️ Architecture

### Project Structure

```
CodeWise/
├── app/                    # Next.js app directory
│   ├── blind75/           # Blind 75 problems page
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Blind75Checklist.tsx
│   ├── ChallengePanel.tsx
│   ├── CodeEditor.tsx
│   ├── FeedbackCard.tsx
│   ├── Header.tsx
│   ├── ImageHintUploader.tsx
│   ├── ProblemDisplay.tsx
│   ├── UserProfile.tsx
│   └── VoiceExplanationRecorder.tsx
├── lib/                   # Utilities and API client
│   └── api.ts            # API client functions
├── services/             # Backend services
│   ├── agentService.js   # AI service orchestration
│   ├── geminiService.js  # Google Gemini AI integration
│   ├── blind75Service.js # Blind 75 problem management
│   ├── memoryStore.js    # In-memory data storage
│   └── mongoStore.js     # MongoDB integration
├── models/               # Database models
│   ├── Blind75Problem.js
│   ├── Problem.js
│   ├── User.js
│   └── UserBlind75Progress.js
├── data/                 # Static data
│   └── blind75.json     # Blind 75 problems
└── server.js            # Express server
```

## 🔌 API Documentation

### Core Endpoints

- `POST /api/request_challenge` - Generate AI-powered coding challenge
- `POST /api/submit_solution` - Submit solution for AI evaluation
- `POST /api/get_image_hint` - Analyze uploaded notes for hints
- `POST /api/evaluate_explanation` - Evaluate voice explanation with AI
- `GET /api/user_profile/:user_id` - Get user progress and statistics
- `GET /api/patterns` - List available algorithmic patterns

### Blind 75 Endpoints

- `GET /api/blind75/problems` - Get all Blind 75 problems
- `GET /api/blind75/problems/:slug` - Get specific problem
- `POST /api/blind75/submit` - Submit Blind 75 solution
- `GET /api/blind75/statistics/:user_id` - Get detailed statistics

### System

- `GET /api/agent_metrics` - Get AI performance metrics
- `GET /api/health` - Health check endpoint

## 🎯 Supported Patterns

- **Arrays & Strings** - Two pointers, sliding window, hash maps
- **Dynamic Programming** - Memoization, tabulation, optimization
- **Graphs** - BFS, DFS, shortest path algorithms
- **Trees** - Binary trees, BST operations, traversals
- **Sorting & Searching** - Binary search, merge sort, quick sort
- **Greedy Algorithms** - Activity selection, scheduling
- **Backtracking** - N-queens, permutations, combinations
- **Linked Lists** - Reversal, merging, cycle detection
- **Stacks & Queues** - Monotonic stacks, priority queues
- **Bit Manipulation** - XOR operations, bit counting

## 🐛 Troubleshooting

### Common Issues

**Q: AI features not working?**
A: Ensure your `GEMINI_API_KEY` is set correctly in the `.env` file.

**Q: Voice recording not working?**
A: Make sure you've granted microphone permissions to your browser. Check browser console for permission errors.

**Q: MongoDB connection failed?**
A: The app will automatically fall back to in-memory storage. Check your MongoDB installation and connection string.

**Q: Port already in use?**
A: Change the `PORT` in your `.env` file or stop the process using that port.

**Q: Voice evaluation giving errors?**
A: Ensure your recording contains actual speech. The AI will detect and report if the audio is just noise or silence.

### Getting Help

- **GitHub Issues** - Report bugs and request features
- **GitHub Discussions** - Ask questions and share ideas

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NeetCode** - For the Blind 75 problem curation
- **Google** - For the Gemini AI API and multimodal capabilities
- **LeetCode** - For the problem format and examples
- **Vercel** - For hosting and deployment platform
- **The Coding Community** - For inspiration and feedback

## 📞 Support

- **GitHub Issues**: [Report bugs and request features](https://github.com/pratham-rajesh/CodeWise/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/pratham-rajesh/CodeWise/discussions)

---

<div align="center">

**Built with ❤️ for the coding community**

[⭐ Star this repo](https://github.com/pratham-rajesh/CodeWise) | [🐛 Report Bug](https://github.com/pratham-rajesh/CodeWise/issues) | [💡 Request Feature](https://github.com/pratham-rajesh/CodeWise/issues)

</div>