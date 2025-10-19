const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: String,
  pattern: { type: String, required: true, index: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  examples: Array,
  test_cases: Array,
  constraints: Array,
  hints: Array,
  solved: { type: Boolean, default: false },
  solution_code: String,
  evaluation: {
    correct: Boolean,
    score: Number,
    complexity: Object,
    feedback: String
  },
  created_at: { type: Date, default: Date.now },
  solved_at: Date
}, { timestamps: true });

problemSchema.index({ user_id: 1, pattern: 1 });
problemSchema.index({ user_id: 1, solved: 1 });

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;
