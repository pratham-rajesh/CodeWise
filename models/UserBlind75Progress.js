const mongoose = require('mongoose');

const UserBlind75ProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  completedProblems: [{
    type: String  // Array of problemIds
  }],
  problemProgress: {
    type: Map,
    of: {
      status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started'
      },
      attempts: {
        type: Number,
        default: 0
      },
      lastAttempt: Date,
      completedAt: Date,
      notes: String
    },
    default: {}
  },
  lastPracticed: {
    type: Date
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  patternBreakdown: {
    type: Map,
    of: {
      total: Number,
      completed: Number,
      percentage: Number
    },
    default: {}
  }
}, {
  timestamps: true
});

// Method to update progress when a problem is completed
UserBlind75ProgressSchema.methods.markProblemCompleted = function(problemId, pattern) {
  if (!this.completedProblems.includes(problemId)) {
    this.completedProblems.push(problemId);
  }

  // Update problem progress
  const progress = this.problemProgress.get(problemId) || {};
  progress.status = 'completed';
  progress.attempts = (progress.attempts || 0) + 1;
  progress.completedAt = new Date();
  this.problemProgress.set(problemId, progress);

  // Update overall progress
  this.progressPercentage = (this.completedProblems.length / 75) * 100;
  this.lastPracticed = new Date();

  return this.save();
};

// Method to mark problem as in progress
UserBlind75ProgressSchema.methods.markProblemInProgress = function(problemId) {
  const progress = this.problemProgress.get(problemId) || {};
  if (progress.status !== 'completed') {
    progress.status = 'in_progress';
    progress.attempts = (progress.attempts || 0) + 1;
    progress.lastAttempt = new Date();
    this.problemProgress.set(problemId, progress);
    this.lastPracticed = new Date();
  }
  return this.save();
};

module.exports = mongoose.model('UserBlind75Progress', UserBlind75ProgressSchema);
