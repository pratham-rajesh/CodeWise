# Setup Guide for Pattern-Trainer Agent

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Google Gemini API Key

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

## Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express: Web server framework
- cors: Cross-origin resource sharing
- body-parser: Parse incoming request bodies
- @google/generative-ai: Google Gemini API client
- dotenv: Environment variable management
- uuid: Generate unique identifiers

## Step 3: Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```

## Step 4: Run the Application

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Step 5: Open in Browser

Navigate to: http://localhost:3000

## Testing the Application

1. **Select a Pattern**: Choose from the dropdown (e.g., "Sliding Window")
2. **Choose Difficulty**: Easy, Medium, or Hard
3. **Get Challenge**: Click the button to generate a problem
4. **Write Solution**: Code your solution in the editor
5. **Submit**: Get AI-powered feedback
6. **Track Progress**: View your weak/strong patterns

## Troubleshooting

### "GEMINI_API_KEY not set" Warning

- Make sure you created the `.env` file
- Ensure your API key is correctly pasted
- Restart the server after adding the key

### Port Already in Use

If port 3000 is busy, change it in `.env`:
```
PORT=3001
```

### Mock Data vs Real AI

If Gemini API is not configured, the app will use mock data to demonstrate functionality. To get real AI-generated problems and feedback, you must configure the API key.

## Project Structure

```
pattern-trainer-agent/
├── public/              # Frontend files
│   ├── index.html      # Main HTML page
│   ├── styles.css      # Styling
│   └── app.js          # Frontend JavaScript
├── services/           # Backend services
│   ├── memoryStore.js  # User data & tracking
│   ├── geminiService.js # AI integration
│   └── agentService.js  # Agent architecture
├── data/               # Auto-created for user data
├── server.js           # Express server
├── package.json        # Dependencies
├── .env               # Environment config (create this)
└── README.md          # Documentation
```

## Next Steps

After basic setup:
1. Try all different patterns
2. Submit multiple solutions to see adaptive learning
3. Check your profile to see weak/strong patterns
4. Monitor credit usage in the stats bar

## For Hackathon Demo

1. Prepare a few sample solutions for quick demo
2. Show the agent service logs in the terminal
3. Demonstrate weak pattern detection
4. Highlight the Gemini AI integration
5. Show credit tracking (agent economy)

Enjoy using Pattern-Trainer Agent! 🎯
