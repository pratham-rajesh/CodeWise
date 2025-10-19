const Blind75Problem = require('../models/Blind75Problem');
const UserBlind75Progress = require('../models/UserBlind75Progress');
const fs = require('fs');
const path = require('path');
const { isConnected } = require('../config/database');

class Blind75Service {
  constructor() {
    this.dataLoaded = false;
  }

  /**
   * Load Blind 75 problems from JSON into MongoDB (one-time seed)
   */
  async seedProblems() {
    if (!isConnected()) {
      console.log('⚠️  MongoDB not connected. Skipping Blind 75 seed.');
      return false;
    }

    try {
      // Check if already seeded
      const count = await Blind75Problem.countDocuments();
      if (count > 0) {
        console.log(`✅ Blind 75 already seeded (${count} problems)`);
        this.dataLoaded = true;
        return true;
      }

      // Load from JSON
      const dataPath = path.join(__dirname, '../data/blind75.json');
      if (!fs.existsSync(dataPath)) {
        console.log('⚠️  blind75.json not found. Run fetchFromLeetCode.js first.');
        return false;
      }

      const problems = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      console.log(`📥 Seeding ${problems.length} Blind 75 problems...`);

      // Insert into MongoDB
      await Blind75Problem.insertMany(problems);
      console.log(`✅ Successfully seeded ${problems.length} problems`);
      this.dataLoaded = true;
      return true;

    } catch (error) {
      console.error('❌ Error seeding Blind 75:', error.message);
      return false;
    }
  }

  /**
   * Get all Blind 75 problems with user progress
   */
  async getAllProblems(userId, filters = {}) {
    if (!isConnected()) {
      return [];
    }

    try {
      const query = {};

      // Apply filters
      if (filters.pattern) {
        query.pattern = filters.pattern;
      }
      if (filters.difficulty) {
        query.difficulty = filters.difficulty;
      }

      const problems = await Blind75Problem.find(query).sort({ order: 1 }).lean();

      // Get user progress
      if (userId) {
        const progress = await this.getUserProgress(userId);
        const completedIds = new Set(progress.completedProblems);

        // Enrich problems with completion status
        return problems.map(p => ({
          ...p,
          completed: completedIds.has(p.problemId),
          progressInfo: progress.problemProgress[p.problemId] || null
        }));
      }

      return problems;

    } catch (error) {
      console.error('Error getting Blind 75 problems:', error.message);
      return [];
    }
  }

  /**
   * Get a specific problem by slug
   */
  async getProblemBySlug(slug) {
    if (!isConnected()) {
      return null;
    }

    try {
      return await Blind75Problem.findOne({ titleSlug: slug }).lean();
    } catch (error) {
      console.error('Error getting problem:', error.message);
      return null;
    }
  }

  /**
   * Get problems by pattern
   */
  async getProblemsByPattern(pattern, userId) {
    return this.getAllProblems(userId, { pattern });
  }

  /**
   * Get user's Blind 75 progress
   */
  async getUserProgress(userId) {
    if (!isConnected()) {
      return {
        userId,
        completedProblems: [],
        progressPercentage: 0,
        problemProgress: {},
        patternBreakdown: {}
      };
    }

    try {
      let progress = await UserBlind75Progress.findOne({ userId });

      if (!progress) {
        // Create new progress tracker
        progress = await UserBlind75Progress.create({
          userId,
          completedProblems: [],
          problemProgress: {},
          progressPercentage: 0
        });
      }

      // Convert to plain object
      const progressObj = progress.toObject ? progress.toObject() : progress;

      return {
        userId: progressObj.userId,
        completedProblems: progressObj.completedProblems || [],
        progressPercentage: progressObj.progressPercentage || 0,
        problemProgress: progressObj.problemProgress instanceof Map
          ? Object.fromEntries(progressObj.problemProgress)
          : (progressObj.problemProgress || {}),
        patternBreakdown: progressObj.patternBreakdown instanceof Map
          ? Object.fromEntries(progressObj.patternBreakdown)
          : (progressObj.patternBreakdown || {}),
        lastPracticed: progressObj.lastPracticed
      };

    } catch (error) {
      console.error('Error getting user progress:', error.message);
      return {
        userId,
        completedProblems: [],
        progressPercentage: 0,
        problemProgress: {},
        patternBreakdown: {}
      };
    }
  }

  /**
   * Mark a problem as completed
   */
  async markProblemCompleted(userId, problemId) {
    if (!isConnected()) {
      return false;
    }

    try {
      // Get problem to find its pattern
      const problem = await Blind75Problem.findOne({ problemId });
      if (!problem) {
        return false;
      }

      let progress = await UserBlind75Progress.findOne({ userId });
      if (!progress) {
        progress = new UserBlind75Progress({ userId });
      }

      await progress.markProblemCompleted(problemId, problem.pattern);
      return true;

    } catch (error) {
      console.error('Error marking problem completed:', error.message);
      return false;
    }
  }

  /**
   * Mark a problem as in progress
   */
  async markProblemInProgress(userId, problemId) {
    if (!isConnected()) {
      return false;
    }

    try {
      let progress = await UserBlind75Progress.findOne({ userId });
      if (!progress) {
        progress = new UserBlind75Progress({ userId });
      }

      await progress.markProblemInProgress(problemId);
      return true;

    } catch (error) {
      console.error('Error marking problem in progress:', error.message);
      return false;
    }
  }

  /**
   * Reset user progress
   */
  async resetProgress(userId) {
    if (!isConnected()) {
      return false;
    }

    try {
      await UserBlind75Progress.deleteOne({ userId });
      return true;
    } catch (error) {
      console.error('Error resetting progress:', error.message);
      return false;
    }
  }

  /**
   * Get statistics (pattern breakdown, difficulty breakdown, etc.)
   */
  async getStatistics(userId) {
    if (!isConnected()) {
      return null;
    }

    try {
      const problems = await this.getAllProblems(userId);
      const progress = await this.getUserProgress(userId);

      const stats = {
        total: problems.length,
        completed: progress.completedProblems.length,
        remaining: problems.length - progress.completedProblems.length,
        progressPercentage: progress.progressPercentage,
        byPattern: {},
        byDifficulty: {
          Easy: { total: 0, completed: 0 },
          Medium: { total: 0, completed: 0 },
          Hard: { total: 0, completed: 0 }
        }
      };

      problems.forEach(p => {
        // Pattern breakdown
        if (!stats.byPattern[p.pattern]) {
          stats.byPattern[p.pattern] = { total: 0, completed: 0 };
        }
        stats.byPattern[p.pattern].total++;
        if (p.completed) {
          stats.byPattern[p.pattern].completed++;
        }

        // Difficulty breakdown
        stats.byDifficulty[p.difficulty].total++;
        if (p.completed) {
          stats.byDifficulty[p.difficulty].completed++;
        }
      });

      return stats;

    } catch (error) {
      console.error('Error getting statistics:', error.message);
      return null;
    }
  }
}

module.exports = new Blind75Service();
