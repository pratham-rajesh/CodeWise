# Pattern-Trainer Agent 🎯

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)](https://tailwindcss.com/)

> **AI-Powered Algorithm Practice with Adaptive Learning** - Master coding interview patterns through intelligent problem generation and personalized feedback.

## 🌟 Features

### 🤖 **AI-Powered Learning**
- **Google Gemini AI** integration for dynamic problem generation
- **Intelligent Code Evaluation** with detailed feedback and scoring
- **Adaptive Learning** that tracks weak patterns and provides personalized recommendations
- **Image Hint System** - Upload handwritten notes for AI analysis and hints

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
- **Agent Marketplace** - Fetch.ai inspired architecture with credit-based AI services
- **Dual Storage** - MongoDB with in-memory fallback for reliability
- **RESTful API** - Well-documented endpoints for all functionality
- **TypeScript** - Full type safety across frontend and backend

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ 
- **npm** or **yarn**
- **MongoDB** (optional - falls back to in-memory storage)
- **Google Gemini API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pattern-trainer-agent.git
   cd pattern-trainer-agent
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
   MONGODB_URI=mongodb://localhost:27017/pattern-trainer
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

## 📖 Usage

### Getting Started

1. **Select a Pattern** - Choose from 10+ algorithmic patterns (Sliding Window, Two Pointers, etc.)
2. **Choose Difficulty** - Pick Easy, Medium, or Hard based on your skill level
3. **Generate Challenge** - AI creates a unique problem tailored to your selection
4. **Write Your Solution** - Use the built-in code editor to implement your solution
5. **Get AI Feedback** - Receive detailed evaluation with suggestions and scoring
6. **Track Progress** - Monitor your improvement across different patterns

### Blind 75 Practice

1. **Navigate to Blind 75** - Access the curated list of most important interview problems
2. **Filter by Pattern/Difficulty** - Focus on specific areas you want to improve
3. **Track Completion** - Mark problems as completed and monitor your progress
4. **View Statistics** - See detailed breakdowns by pattern and difficulty

### Advanced Features

- **Image Hints** - Upload handwritten notes or diagrams for AI analysis
- **Weak Pattern Detection** - Get personalized recommendations for improvement
- **Progress Analytics** - Detailed statistics on your coding journey

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI component library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework

#### Backend
- **Express.js** - Node.js web framework
- **Google Gemini AI** - AI problem generation and evaluation
- **MongoDB** - Optional persistent storage
- **Mongoose** - MongoDB object modeling

#### AI & Services
- **Agent Service Layer** - Fetch.ai inspired architecture
- **Credit System** - Track AI usage and costs
- **Memory Store** - In-memory fallback for reliability

### Project Structure

```
pattern-trainer-agent/
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
│   └── UserProfile.tsx
├── lib/                   # Utilities and API client
│   └── api.ts            # API client functions
├── services/             # Backend services
│   ├── agentService.js   # Agent marketplace logic
│   ├── geminiService.js  # Google Gemini AI integration
│   ├── blind75Service.js # Blind 75 problem management
│   ├── memoryStore.js    # In-memory data storage
│   └── mongoStore.js     # MongoDB data storage
├── models/               # Database models
│   ├── Blind75Problem.js
│   ├── Problem.js
│   ├── User.js
│   └── UserBlind75Progress.js
├── config/               # Configuration
│   └── database.js       # Database connection
├── data/                 # Static data files
│   ├── blind75.json      # Blind 75 problems data
│   └── blind75-slugs.json
├── scripts/              # Utility scripts
│   ├── fetchFromLeetCode.js
│   └── parseExcel.js
├── server.js             # Express backend server
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## 🔌 API Endpoints

### Core Features
- `POST /api/request_challenge` - Generate AI-powered coding challenge
- `POST /api/submit_solution` - Submit solution for AI evaluation
- `POST /api/get_image_hint` - Analyze uploaded notes for hints
- `GET /api/user_profile/:user_id` - Get user progress and statistics
- `GET /api/patterns` - List available algorithmic patterns

### Blind 75 Features
- `GET /api/blind75` - Get all Blind 75 problems with filters
- `GET /api/blind75/pattern/:pattern` - Filter by specific pattern
- `GET /api/blind75/problem/:slug` - Get specific problem details
- `POST /api/blind75/:slug/complete` - Mark problem as completed
- `GET /api/blind75/progress/:user_id` - Get user's Blind 75 progress
- `GET /api/blind75/statistics/:user_id` - Get detailed statistics

### System
- `GET /api/agent_metrics` - Get AI agent performance metrics
- `GET /api/health` - Health check endpoint

## 🎯 Supported Patterns

| Pattern | Description | Difficulty Range |
|---------|-------------|------------------|
| **Sliding Window** | Maintain a window that slides through data | Easy - Hard |
| **Two Pointers** | Use two pointers to traverse from different positions | Easy - Medium |
| **Binary Search** | Divide and conquer on sorted data | Medium - Hard |
| **Dynamic Programming** | Break down into overlapping subproblems | Medium - Hard |
| **Graph BFS** | Breadth-first search for graph traversal | Medium - Hard |
| **Graph DFS** | Depth-first search for graph traversal | Medium - Hard |
| **Backtracking** | Explore all possibilities by trying choices | Medium - Hard |
| **Greedy** | Make locally optimal choices at each step | Easy - Medium |
| **Heap/Priority Queue** | Use heap for priority-based problems | Medium - Hard |
| **Linked List** | Manipulate linked list data structures | Easy - Medium |

## 🔧 Configuration

### Environment Variables

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=3000
USE_MONGODB=true
MONGODB_URI=mongodb://localhost:27017/pattern-trainer
```

### MongoDB Setup (Optional)

1. **Install MongoDB**
   ```bash
   # macOS
   brew install mongodb-community
   
   # Ubuntu
   sudo apt-get install mongodb
   ```

2. **Start MongoDB**
   ```bash
   mongod
   ```

3. **Enable in .env**
   ```env
   USE_MONGODB=true
   MONGODB_URI=mongodb://localhost:27017/pattern-trainer
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Docker

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start:next  # Frontend
npm run start:server  # Backend (separate terminal)
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## 📊 Performance

- **AI Response Time**: ~2-5 seconds for problem generation
- **Code Evaluation**: ~1-3 seconds for solution analysis
- **Database Queries**: <100ms for most operations
- **Frontend Load Time**: <2 seconds on modern browsers

## 🔒 Security

- **API Key Protection** - Environment variables for sensitive data
- **Input Validation** - All user inputs are validated and sanitized
- **Rate Limiting** - Built-in protection against abuse
- **CORS Configuration** - Proper cross-origin resource sharing setup

## 📈 Roadmap

### Upcoming Features
- [ ] **Multi-language Support** - Python, Java, C++ solutions
- [ ] **Collaborative Features** - Share problems and solutions
- [ ] **Advanced Analytics** - Detailed performance insights
- [ ] **Mobile App** - React Native version
- [ ] **Interview Simulator** - Mock interview sessions
- [ ] **Company-Specific Prep** - FAANG and startup focused problems

### Long-term Vision
- [ ] **AI Tutoring** - Personalized learning paths
- [ ] **Community Features** - User-generated content and discussions
- [ ] **Enterprise Version** - Team-based learning and analytics
- [ ] **Integration APIs** - Connect with other learning platforms

## 🐛 Troubleshooting

### Common Issues

**Q: AI features not working?**
A: Ensure your `GEMINI_API_KEY` is set correctly in the `.env` file.

**Q: MongoDB connection failed?**
A: The app will automatically fall back to in-memory storage. Check your MongoDB installation and connection string.

**Q: Build errors?**
A: Make sure you're using Node.js 16+ and run `npm install` to ensure all dependencies are installed.

**Q: Port already in use?**
A: Change the `PORT` in your `.env` file or stop the process using that port.

### Getting Help

- **GitHub Issues** - Report bugs and request features
- **Discussions** - Ask questions and share ideas
- **Documentation** - Check the wiki for detailed guides

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NeetCode** - For the Blind 75 problem curation
- **Google** - For the Gemini AI API
- **Fetch.ai** - For agent architecture inspiration
- **LeetCode** - For the problem format and examples
- **Vercel** - For hosting and deployment platform

## 📞 Support

- **Email**: support@patterntrainer.dev
- **Discord**: [Join our community](https://discord.gg/patterntrainer)
- **Twitter**: [@PatternTrainer](https://twitter.com/patterntrainer)

---

<div align="center">

**Built with ❤️ for the coding community**

[⭐ Star this repo](https://github.com/yourusername/pattern-trainer-agent) | [🐛 Report Bug](https://github.com/yourusername/pattern-trainer-agent/issues) | [💡 Request Feature](https://github.com/yourusername/pattern-trainer-agent/issues)

</div>