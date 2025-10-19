const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class MemoryStore {
  constructor() {
    this.users = new Map();
    this.dataDir = path.join(__dirname, '../data');
    this.dataFile = path.join(this.dataDir, 'users.json');
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.users = new Map(Object.entries(data));
        console.log(`Loaded ${this.users.size} users from disk`);
      }
    } catch (error) {
      console.error('Error loading data from disk:', error);
    }
  }

  saveToDisk() {
    try {
      const data = Object.fromEntries(this.users);
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving data to disk:', error);
    }
  }

  getUser(userId) {
    if (!this.users.has(userId)) {
      this.users.set(userId, this.createNewUser(userId));
      this.saveToDisk();
    }
    return this.users.get(userId);
  }

  createNewUser(userId) {
    return {
      id: userId,
      credits_used: 0,
      total_challenges: 0,
      total_submissions: 0,
      weak_patterns: {},
      strong_patterns: {},
      pattern_stats: {},
      history: [],
      created_at: new Date().toISOString()
    };
  }

  updateUserAfterChallenge(userId, pattern, difficulty) {
    const user = this.getUser(userId);
    user.total_challenges++;
    user.credits_used++;

    if (!user.pattern_stats[pattern]) {
      user.pattern_stats[pattern] = {
        attempts: 0,
        successes: 0,
        failures: 0,
        last_attempt: null
      };
    }

    user.history.push({
      id: uuidv4(),
      type: 'challenge_requested',
      pattern,
      difficulty,
      timestamp: new Date().toISOString()
    });

    this.saveToDisk();
    return user;
  }

  updateUserAfterSubmission(userId, pattern, isCorrect, feedback) {
    const user = this.getUser(userId);
    user.total_submissions++;

    if (!user.pattern_stats[pattern]) {
      user.pattern_stats[pattern] = {
        attempts: 0,
        successes: 0,
        failures: 0,
        last_attempt: null
      };
    }

    const stats = user.pattern_stats[pattern];
    stats.attempts++;
    stats.last_attempt = new Date().toISOString();

    if (isCorrect) {
      stats.successes++;
      // If success rate > 70%, consider it a strong pattern
      const successRate = stats.successes / stats.attempts;
      if (successRate >= 0.7 && stats.attempts >= 2) {
        user.strong_patterns[pattern] = successRate;
        delete user.weak_patterns[pattern];
      }
    } else {
      stats.failures++;
      // If success rate < 50%, consider it a weak pattern
      const successRate = stats.successes / stats.attempts;
      if (successRate < 0.5 && stats.attempts >= 1) {
        user.weak_patterns[pattern] = 1 - successRate;
        delete user.strong_patterns[pattern];
      }
    }

    console.log(`[Memory Store] Pattern: ${pattern}, Attempts: ${stats.attempts}, Success Rate: ${(stats.successes / stats.attempts * 100).toFixed(1)}%`);
    console.log(`[Memory Store] Weak patterns:`, Object.keys(user.weak_patterns));
    console.log(`[Memory Store] Strong patterns:`, Object.keys(user.strong_patterns));

    user.history.push({
      id: uuidv4(),
      type: 'solution_submitted',
      pattern,
      correct: isCorrect,
      feedback_summary: feedback.complexity || 'N/A',
      timestamp: new Date().toISOString()
    });

    // Keep only last 100 history items
    if (user.history.length > 100) {
      user.history = user.history.slice(-100);
    }

    this.saveToDisk();
    return user;
  }

  getUserProfile(userId) {
    const user = this.getUser(userId);

    // Calculate overall success rate
    let totalAttempts = 0;
    let totalSuccesses = 0;
    Object.values(user.pattern_stats).forEach(stats => {
      totalAttempts += stats.attempts;
      totalSuccesses += stats.successes;
    });

    const overallSuccessRate = totalAttempts > 0
      ? (totalSuccesses / totalAttempts * 100).toFixed(1)
      : 0;

    // Get top weak patterns
    const topWeakPatterns = Object.entries(user.weak_patterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([pattern, score]) => ({
        pattern,
        weakness_score: (score * 100).toFixed(1)
      }));

    // Get top strong patterns
    const topStrongPatterns = Object.entries(user.strong_patterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([pattern, score]) => ({
        pattern,
        success_rate: (score * 100).toFixed(1)
      }));

    return {
      user_id: user.id,
      credits_used: user.credits_used,
      total_challenges: user.total_challenges,
      total_submissions: user.total_submissions,
      overall_success_rate: overallSuccessRate,
      weak_patterns: topWeakPatterns,
      strong_patterns: topStrongPatterns,
      pattern_stats: user.pattern_stats,
      recent_history: user.history.slice(-10).reverse()
    };
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }
}

module.exports = new MemoryStore();
