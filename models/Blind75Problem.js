const mongoose = require('mongoose');

const Blind75ProblemSchema = new mongoose.Schema({
  problemId: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  titleSlug: {
    type: String,
    required: true,
    unique: true
  },
  pattern: {
    type: String,
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  hints: [{
    type: String
  }],
  topicTags: [{
    type: String
  }],
  leetcodeUrl: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String
  },
  notes: {
    type: String
  },
  exampleTestcases: {
    type: String
  },
  sampleTestCase: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
Blind75ProblemSchema.index({ pattern: 1, difficulty: 1 });
Blind75ProblemSchema.index({ order: 1 });

module.exports = mongoose.model('Blind75Problem', Blind75ProblemSchema);
