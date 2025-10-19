const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  credits_used: { type: Number, default: 0 },
  total_challenges: { type: Number, default: 0 },
  total_submissions: { type: Number, default: 0 },
  weak_patterns: { type: Map, of: Number, default: {} },
  strong_patterns: { type: Map, of: Number, default: {} },
  pattern_stats: {
    type: Map,
    of: {
      attempts: Number,
      successes: Number,
      failures: Number,
      last_attempt: Date
    },
    default: {}
  },
  history: { type: Array, default: [] },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
