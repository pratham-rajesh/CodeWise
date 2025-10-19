const User = require('../models/User');
const Problem = require('../models/Problem');
const memoryStore = require('./memoryStore');
const { isConnected } = require('../config/database');

// Wrapper that uses MongoDB if available, otherwise falls back to memoryStore
class MongoStore {
  // Get user - try MongoDB first, fallback to memory
  async getUser(userId) {
    if (!isConnected()) {
      return memoryStore.getUser(userId);
    }

    try {
      let user = await User.findOne({ id: userId }).lean();
      if (!user) {
        const newUser = memoryStore.createNewUser(userId);
        await User.create(newUser);
        return newUser;
      }
      // When using .lean(), MongoDB Maps are already converted to plain objects
      return {
        ...user,
        weak_patterns: user.weak_patterns || {},
        strong_patterns: user.strong_patterns || {},
        pattern_stats: user.pattern_stats || {}
      };
    } catch (error) {
      console.error('MongoDB getUser error:', error.message);
      return memoryStore.getUser(userId);
    }
  }

  // Update after challenge - try MongoDB, fallback to memory
  async updateUserAfterChallenge(userId, pattern, difficulty) {
    if (!isConnected()) {
      return memoryStore.updateUserAfterChallenge(userId, pattern, difficulty);
    }

    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        const newUser = await User.create(memoryStore.createNewUser(userId));
        return this.convertUser(newUser);
      }

      user.total_challenges++;
      user.credits_used++;

      await user.save();
      return this.convertUser(user);
    } catch (error) {
      console.error('MongoDB updateAfterChallenge error:', error.message);
      return memoryStore.updateUserAfterChallenge(userId, pattern, difficulty);
    }
  }

  // Update after submission - try MongoDB, fallback to memory
  async updateUserAfterSubmission(userId, pattern, isCorrect, feedback) {
    if (!isConnected()) {
      return memoryStore.updateUserAfterSubmission(userId, pattern, isCorrect, feedback);
    }

    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return memoryStore.updateUserAfterSubmission(userId, pattern, isCorrect, feedback);
      }

      user.total_submissions++;

      // Get or create pattern stats
      let stats = user.pattern_stats.get(pattern) || {
        attempts: 0,
        successes: 0,
        failures: 0,
        last_attempt: null
      };

      stats.attempts++;
      stats.last_attempt = new Date();

      if (isCorrect) {
        stats.successes++;
        const successRate = stats.successes / stats.attempts;
        if (successRate >= 0.7 && stats.attempts >= 2) {
          user.strong_patterns.set(pattern, successRate);
          user.weak_patterns.delete(pattern);
        }
      } else {
        stats.failures++;
        const successRate = stats.successes / stats.attempts;
        if (successRate < 0.5 && stats.attempts >= 1) {
          user.weak_patterns.set(pattern, 1 - successRate);
          user.strong_patterns.delete(pattern);
        }
      }

      user.pattern_stats.set(pattern, stats);

      await user.save();
      return this.convertUser(user);
    } catch (error) {
      console.error('MongoDB updateAfterSubmission error:', error.message);
      return memoryStore.updateUserAfterSubmission(userId, pattern, isCorrect, feedback);
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    if (!isConnected()) {
      return memoryStore.getUserProfile(userId);
    }

    try {
      const user = await User.findOne({ id: userId }).lean();
      if (!user) {
        return memoryStore.getUserProfile(userId);
      }

      // Convert to profile format
      // When using .lean(), MongoDB Maps are already converted to plain objects
      const patternStatsObj = user.pattern_stats || {};
      let totalAttempts = 0;
      let totalSuccesses = 0;

      Object.values(patternStatsObj).forEach(stats => {
        totalAttempts += stats.attempts || 0;
        totalSuccesses += stats.successes || 0;
      });

      const overallSuccessRate = totalAttempts > 0
        ? (totalSuccesses / totalAttempts * 100).toFixed(1)
        : 0;

      const weakPatternsObj = user.weak_patterns || {};
      const topWeakPatterns = Object.entries(weakPatternsObj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([pattern, score]) => ({ pattern, weakness_score: (score * 100).toFixed(1) }));

      const strongPatternsObj = user.strong_patterns || {};
      const topStrongPatterns = Object.entries(strongPatternsObj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([pattern, score]) => ({ pattern, success_rate: (score * 100).toFixed(1) }));

      return {
        user_id: user.id,
        credits_used: user.credits_used,
        total_challenges: user.total_challenges,
        total_submissions: user.total_submissions,
        overall_success_rate: overallSuccessRate,
        weak_patterns: topWeakPatterns,
        strong_patterns: topStrongPatterns,
        pattern_stats: patternStatsObj,
        recent_history: (user.history || []).slice(-10).reverse()
      };
    } catch (error) {
      console.error('MongoDB getUserProfile error:', error.message);
      return memoryStore.getUserProfile(userId);
    }
  }

  // Save problem to MongoDB
  async saveProblem(userId, problemData) {
    if (!isConnected()) {
      return problemData;
    }

    try {
      await Problem.create({ ...problemData, user_id: userId });
      return problemData;
    } catch (error) {
      console.error('MongoDB saveProblem error:', error.message);
      return problemData;
    }
  }

  // Update problem with solution
  async updateProblemSolution(userId, pattern, code, evaluation) {
    if (!isConnected()) {
      return null;
    }

    try {
      const problem = await Problem.findOne({
        user_id: userId,
        pattern: pattern,
        solved: false
      }).sort({ created_at: -1 });

      if (problem) {
        problem.solved = evaluation.correct;
        problem.solved_at = evaluation.correct ? new Date() : null;
        problem.solution_code = code;
        problem.evaluation = {
          correct: evaluation.correct,
          score: evaluation.score,
          complexity: evaluation.complexity,
          feedback: JSON.stringify(evaluation)
        };
        await problem.save();
      }
      return problem;
    } catch (error) {
      console.error('MongoDB updateProblemSolution error:', error.message);
      return null;
    }
  }

  // Get user problems
  async getUserProblems(userId, filters = {}) {
    if (!isConnected()) {
      return [];
    }

    try {
      const query = { user_id: userId, ...filters };
      const problems = await Problem.find(query).sort({ created_at: -1 }).limit(50).lean();
      return problems;
    } catch (error) {
      console.error('MongoDB getUserProblems error:', error.message);
      return [];
    }
  }

  // Helper to convert MongoDB user to plain object
  convertUser(user) {
    const obj = user.toObject ? user.toObject() : user;
    // toObject() preserves Map types, so we need to check and convert
    return {
      ...obj,
      weak_patterns: obj.weak_patterns instanceof Map ? Object.fromEntries(obj.weak_patterns) : (obj.weak_patterns || {}),
      strong_patterns: obj.strong_patterns instanceof Map ? Object.fromEntries(obj.strong_patterns) : (obj.strong_patterns || {}),
      pattern_stats: obj.pattern_stats instanceof Map ? Object.fromEntries(obj.pattern_stats) : (obj.pattern_stats || {})
    };
  }
}

module.exports = new MongoStore();
