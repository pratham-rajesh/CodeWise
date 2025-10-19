# Pattern-Trainer Agent 🎯

AI-Powered Algorithm Practice with Adaptive Learning - Built with Next.js, React, and Tailwind CSS

## Features

✨ **Modern Notion-Style UI** - Clean, minimalist design with smooth animations
🤖 **AI-Powered Challenges** - Generate coding problems using Google Gemini AI
📊 **Adaptive Learning** - Track weak patterns and get personalized recommendations
💾 **Persistent Storage** - MongoDB support with in-memory fallback
🎨 **Beautiful Components** - Reusable React components with Tailwind CSS
📱 **Responsive Design** - Works seamlessly on all screen sizes

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI component library
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript** - Type-safe development

### Backend
- **Express** - Node.js web framework
- **Google Gemini AI** - AI problem generation and evaluation
- **MongoDB** - Optional persistent storage
- **Fetch.ai** - Agent architecture concepts

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB (optional)
- Google Gemini API key

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables - Create a `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
USE_MONGODB=false
MONGODB_URI=mongodb://localhost:27017/pattern-trainer
```

### Running the Application

**Development Mode** (runs both frontend and backend):
```bash
npm run dev
```

This starts:
- Express backend on `http://localhost:3000`
- Next.js frontend on `http://localhost:3001`

**Run servers separately:**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:next
```

**Production:**
```bash
npm run build
npm run start:next  # Frontend
npm run start:server  # Backend (separate terminal)
```

### Access the Application

Open your browser: **http://localhost:3001**

## Architecture

- **Frontend**: Next.js + React + TypeScript + Tailwind CSS
- **Backend**: Express.js REST API
- **AI Engine**: Google Gemini API
- **Agent Layer**: Credit tracking system for problem generation
- **Storage**: MongoDB with in-memory fallback

## Project Structure

```
pattern-trainer-agent/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx
│   ├── ChallengePanel.tsx
│   ├── UserProfile.tsx
│   ├── ProblemDisplay.tsx
│   ├── CodeEditor.tsx
│   └── FeedbackCard.tsx
├── lib/                   # Utilities
│   └── api.ts            # API client functions
├── services/             # Backend services
│   ├── agentService.js
│   ├── geminiService.js
│   ├── memoryStore.js
│   └── mongoStore.js
├── config/               # Configuration
│   └── database.js
├── public/              # Static files (legacy)
├── server.js            # Express backend server
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## API Endpoints

- `GET /api/patterns` - Get list of available patterns
- `POST /api/request_challenge` - Request a new coding challenge
- `POST /api/submit_solution` - Submit solution for evaluation
- `GET /api/user_profile/:user_id` - Get user profile and statistics
- `GET /api/user_problems/:user_id` - Get user's problem history
- `GET /api/agent_metrics` - Get agent service metrics
- `GET /api/health` - Health check endpoint

## Supported Patterns

- Sliding Window
- Two Pointers
- Binary Search
- Dynamic Programming
- Graph BFS
- Graph DFS
- Backtracking
- Greedy
- Heap/Priority Queue
- Linked List

## Design Philosophy

The UI is inspired by Notion's clean and modern design:

- **Minimalism** - Focus on content with lots of whitespace
- **Smooth Interactions** - 200-300ms transitions for all state changes
- **Subtle Shadows** - Notion-style soft shadows on cards
- **Professional Typography** - Inter font family for readability
- **Accessible Colors** - High contrast text and semantic color coding

## License

MIT

## Credits

Built with ❤️ using Claude Code
