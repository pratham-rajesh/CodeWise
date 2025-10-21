require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const { connectMongoDB, isConnected } = require('./config/database');
const memoryStore = require('./services/memoryStore');
const mongoStore = require('./services/mongoStore');
const agentService = require('./services/agentService');
const geminiService = require('./services/geminiService');
const blind75Service = require('./services/blind75Service');

// Use MongoDB if enabled and connected, otherwise use memoryStore
const USE_MONGODB = process.env.USE_MONGODB !== 'false';
let dataStore = memoryStore; // Default to memoryStore

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
// Increase limit to 10MB to handle image uploads (5MB limit enforced on client side)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==================== API Routes ====================

/**
 * POST /api/request_challenge
 * Request a new coding challenge for a specific pattern
 */
app.post('/api/request_challenge', async (req, res) => {
  try {
    const { user_id, pattern, difficulty = 'medium' } = req.body;

    if (!user_id || !pattern) {
      return res.status(400).json({
        success: false,
        error: 'user_id and pattern are required'
      });
    }

    console.log(`Challenge request from user ${user_id}: ${pattern} (${difficulty})`);

    // Request problem from agent service
    const agentResult = await agentService.requestProblemFromAgent(
      pattern,
      difficulty,
      user_id
    );

    if (!agentResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate problem',
        details: agentResult.error
      });
    }

    // Update user memory
    const user = await dataStore.updateUserAfterChallenge(user_id, pattern, difficulty);

    // Save problem to MongoDB if available
    await dataStore.saveProblem(user_id, agentResult.problem);

    res.json({
      success: true,
      problem: agentResult.problem,
      credits_used: agentResult.credits_used,
      total_credits_used: user.credits_used,
      agent_info: agentResult.agent_info
    });

  } catch (error) {
    console.error('Error in /api/request_challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/submit_solution
 * Submit a solution for evaluation
 */
app.post('/api/submit_solution', async (req, res) => {
  try {
    const { user_id, pattern, code, problem_description } = req.body;

    if (!user_id || !pattern || !code) {
      return res.status(400).json({
        success: false,
        error: 'user_id, pattern, and code are required'
      });
    }

    console.log(`Solution submission from user ${user_id}: ${pattern}`);

    // Request evaluation from agent service
    const agentResult = await agentService.requestEvaluationFromAgent(
      code,
      pattern,
      problem_description || 'No description provided',
      user_id
    );

    if (!agentResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to evaluate code',
        details: agentResult.error
      });
    }

    const evaluation = agentResult.evaluation;

    // Update user memory based on evaluation
    const user = await dataStore.updateUserAfterSubmission(
      user_id,
      pattern,
      evaluation.correct,
      evaluation
    );

    // Update problem with solution
    await dataStore.updateProblemSolution(user_id, pattern, code, evaluation);

    res.json({
      success: true,
      correct: evaluation.correct,
      errors: evaluation.errors,
      complexity: evaluation.complexity,
      suggestions: evaluation.suggestions,
      pattern_usage: evaluation.pattern_usage,
      code_quality: evaluation.code_quality,
      score: evaluation.score,
      credits_used: agentResult.credits_used,
      total_credits_used: user.credits_used,
      weak_patterns: Object.keys(user.weak_patterns),
      agent_info: agentResult.agent_info
    });

  } catch (error) {
    console.error('Error in /api/submit_solution:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/user_profile/:user_id
 * Get user profile with statistics and weak patterns
 */
app.get('/api/user_profile/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }

    const profile = await dataStore.getUserProfile(user_id);

    res.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Error in /api/user_profile:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/patterns
 * Get list of supported patterns
 */
app.get('/api/patterns', (req, res) => {
  const patterns = [
    { id: 'sliding_window', name: 'Sliding Window', description: 'Maintain a window that slides through the data' },
    { id: 'two_pointers', name: 'Two Pointers', description: 'Use two pointers to traverse data from different positions' },
    { id: 'binary_search', name: 'Binary Search', description: 'Divide and conquer on sorted data' },
    { id: 'dynamic_programming', name: 'Dynamic Programming', description: 'Break down problems into overlapping subproblems' },
    { id: 'graph_bfs', name: 'Graph BFS', description: 'Breadth-first search for graph traversal' },
    { id: 'graph_dfs', name: 'Graph DFS', description: 'Depth-first search for graph traversal' },
    { id: 'backtracking', name: 'Backtracking', description: 'Explore all possibilities by trying and undoing choices' },
    { id: 'greedy', name: 'Greedy', description: 'Make locally optimal choices at each step' },
    { id: 'heap', name: 'Heap/Priority Queue', description: 'Use heap data structure for priority-based problems' },
    { id: 'linked_list', name: 'Linked List', description: 'Manipulate linked list data structures' }
  ];

  res.json({
    success: true,
    patterns
  });
});

/**
 * GET /api/user_problems/:user_id
 * Get user's problem history with optional filters
 */
app.get('/api/user_problems/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { pattern, solved } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }

    const filters = {};
    if (pattern) filters.pattern = pattern;
    if (solved !== undefined) filters.solved = solved === 'true';

    const problems = await dataStore.getUserProblems(user_id, filters);

    res.json({
      success: true,
      problems,
      count: problems.length
    });

  } catch (error) {
    console.error('Error in /api/user_problems:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/agent_metrics
 * Get agent service metrics
 */
app.get('/api/agent_metrics', (req, res) => {
  try {
    const metrics = agentService.getAgentMetrics();
    const agents = agentService.getAvailableAgents();

    res.json({
      success: true,
      metrics,
      agents
    });

  } catch (error) {
    console.error('Error in /api/agent_metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/get_image_hint
 * Analyze uploaded image of user notes and provide hints
 */
app.post('/api/get_image_hint', async (req, res) => {
  try {
    const { user_id, image_base64, problem_description, problem_title, pattern, difficulty } = req.body;

    if (!user_id || !image_base64 || !problem_description || !problem_title || !pattern) {
      return res.status(400).json({
        success: false,
        error: 'user_id, image_base64, problem_description, problem_title, and pattern are required'
      });
    }

    console.log(`Image hint request from user ${user_id}: ${problem_title}`);

    // Analyze the image using Gemini Vision
    const result = await geminiService.analyzeNoteImage(
      image_base64,
      problem_title,
      problem_description,
      pattern,
      difficulty || 'medium'
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to analyze image',
        details: result.error
      });
    }

    // Deduct credits (0.5 credits for hint)
    const user = await dataStore.getUser(user_id);
    user.credits_used += 0.5;

    res.json({
      success: true,
      analysis: result.analysis,
      hints: result.hints,
      encouragement: result.encouragement,
      credits_used: 0.5,
      total_credits_used: user.credits_used
    });

  } catch (error) {
    console.error('Error in /api/get_image_hint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/evaluate_explanation
 * Evaluate voice explanation of solution using Gemini Audio API
 */
app.post('/api/evaluate_explanation', async (req, res) => {
  try {
    const { user_id, audio_base64, audio_mime_type, problem_title, problem_description, pattern, difficulty } = req.body;

    if (!user_id || !audio_base64 || !problem_title || !problem_description || !pattern) {
      return res.status(400).json({
        success: false,
        error: 'user_id, audio_base64, problem_title, problem_description, and pattern are required'
      });
    }

    console.log(`Voice explanation evaluation request from user ${user_id}: ${problem_title}`);
    console.log(`Audio MIME type: ${audio_mime_type || 'audio/webm'}`);

    // Evaluate the voice explanation using Gemini Audio
    const result = await geminiService.evaluateVoiceExplanation(
      audio_base64,
      problem_title,
      problem_description,
      pattern,
      difficulty || 'medium',
      audio_mime_type || 'audio/webm'
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to evaluate explanation',
        details: result.error
      });
    }

    // Deduct credits (1 credit for voice evaluation)
    const user = await dataStore.getUser(user_id);
    user.credits_used += 1;

    res.json({
      success: true,
      transcript: result.transcript,
      score: result.score,
      feedback: result.feedback,
      strengths: result.strengths,
      suggestions: result.suggestions,
      credits_used: 1,
      total_credits_used: user.credits_used
    });

  } catch (error) {
    console.error('Error in /api/evaluate_explanation:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// ==================== Blind 75 Routes ====================

/**
 * GET /api/blind75
 * Get all Blind 75 problems with optional filters and user progress
 */
app.get('/api/blind75', async (req, res) => {
  try {
    const { user_id, pattern, difficulty } = req.query;

    const filters = {};
    if (pattern) filters.pattern = pattern;
    if (difficulty) filters.difficulty = difficulty;

    const problems = await blind75Service.getAllProblems(user_id, filters);

    res.json({
      success: true,
      problems,
      count: problems.length
    });

  } catch (error) {
    console.error('Error in /api/blind75:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/blind75/pattern/:pattern
 * Get Blind 75 problems filtered by pattern
 */
app.get('/api/blind75/pattern/:pattern', async (req, res) => {
  try {
    const { pattern } = req.params;
    const { user_id } = req.query;

    const problems = await blind75Service.getProblemsByPattern(pattern, user_id);

    res.json({
      success: true,
      pattern,
      problems,
      count: problems.length
    });

  } catch (error) {
    console.error('Error in /api/blind75/pattern:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/blind75/problem/:slug
 * Get a specific Blind 75 problem by slug
 */
app.get('/api/blind75/problem/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const problem = await blind75Service.getProblemBySlug(slug);

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found'
      });
    }

    res.json({
      success: true,
      problem
    });

  } catch (error) {
    console.error('Error in /api/blind75/problem:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/blind75/:slug/complete
 * Mark a Blind 75 problem as completed
 */
app.post('/api/blind75/:slug/complete', async (req, res) => {
  try {
    const { slug } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }

    // Get problem to find problemId
    const problem = await blind75Service.getProblemBySlug(slug);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found'
      });
    }

    const success = await blind75Service.markProblemCompleted(user_id, problem.problemId);

    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to mark problem as completed'
      });
    }

    const progress = await blind75Service.getUserProgress(user_id);

    res.json({
      success: true,
      message: 'Problem marked as completed',
      progress
    });

  } catch (error) {
    console.error('Error in /api/blind75/complete:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/blind75/:slug/in-progress
 * Mark a Blind 75 problem as in progress
 */
app.post('/api/blind75/:slug/in-progress', async (req, res) => {
  try {
    const { slug } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }

    // Get problem to find problemId
    const problem = await blind75Service.getProblemBySlug(slug);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found'
      });
    }

    const success = await blind75Service.markProblemInProgress(user_id, problem.problemId);

    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to mark problem as in progress'
      });
    }

    const progress = await blind75Service.getUserProgress(user_id);

    res.json({
      success: true,
      message: 'Problem marked as in progress',
      progress
    });

  } catch (error) {
    console.error('Error in /api/blind75/in-progress:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/blind75/progress/:user_id
 * Get user's Blind 75 progress
 */
app.get('/api/blind75/progress/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const progress = await blind75Service.getUserProgress(user_id);

    res.json({
      success: true,
      progress
    });

  } catch (error) {
    console.error('Error in /api/blind75/progress:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/blind75/:user_id/reset
 * Reset user's Blind 75 progress
 */
app.post('/api/blind75/:user_id/reset', async (req, res) => {
  try {
    const { user_id } = req.params;

    const success = await blind75Service.resetProgress(user_id);

    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to reset progress'
      });
    }

    res.json({
      success: true,
      message: 'Progress reset successfully'
    });

  } catch (error) {
    console.error('Error in /api/blind75/reset:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/blind75/statistics/:user_id
 * Get Blind 75 statistics with pattern and difficulty breakdown
 */
app.get('/api/blind75/statistics/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const statistics = await blind75Service.getStatistics(user_id);

    if (!statistics) {
      return res.status(500).json({
        success: false,
        error: 'Failed to get statistics'
      });
    }

    res.json({
      success: true,
      statistics
    });

  } catch (error) {
    console.error('Error in /api/blind75/statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    gemini_configured: !!process.env.GEMINI_API_KEY,
    mongodb_connected: isConnected(),
    storage_type: isConnected() ? 'mongodb' : 'in-memory'
  });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server with async initialization
async function startServer() {
  // Try to connect to MongoDB if enabled
  if (USE_MONGODB) {
    console.log('🔄 Attempting MongoDB connection...');
    const connected = await connectMongoDB();
    if (connected) {
      dataStore = mongoStore;
      console.log('✅ Using MongoDB for data storage');

      // Seed Blind 75 problems if MongoDB is connected
      await blind75Service.seedProblems();
    } else {
      console.log('⚠️  Using in-memory storage as fallback');
    }
  } else {
    console.log('ℹ️  MongoDB disabled via USE_MONGODB env variable');
    console.log('📦 Using in-memory storage');
  }

  const server = app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🎯 Pattern-Trainer Agent Server Started!');
    console.log('='.repeat(60));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🤖 Gemini API configured: ${!!process.env.GEMINI_API_KEY}`);
    console.log(`💾 Storage type: ${isConnected() ? 'MongoDB' : 'In-Memory'}`);
    console.log(`📊 Agent marketplace active`);
    console.log('='.repeat(60));
    console.log('Available endpoints:');
    console.log('  POST   /api/request_challenge');
    console.log('  POST   /api/submit_solution');
    console.log('  POST   /api/get_image_hint');
    console.log('  GET    /api/user_profile/:user_id');
    console.log('  GET    /api/user_problems/:user_id');
    console.log('  GET    /api/patterns');
    console.log('  GET    /api/agent_metrics');
    console.log('  GET    /api/blind75');
    console.log('  GET    /api/blind75/pattern/:pattern');
    console.log('  GET    /api/blind75/problem/:slug');
    console.log('  POST   /api/blind75/:slug/complete');
    console.log('  GET    /api/blind75/progress/:user_id');
    console.log('  GET    /api/blind75/statistics/:user_id');
    console.log('  GET    /api/health');
    console.log('='.repeat(60));
  });

  // Set server timeout to 5 minutes (AI API calls can take time)
  server.timeout = 300000; // 5 minutes
  server.keepAliveTimeout = 300000;
  server.headersTimeout = 310000; // Slightly higher than keepAliveTimeout
}

// Start the server
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
