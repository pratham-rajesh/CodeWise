const mongoose = require('mongoose');

async function connectMongoDB() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pattern-trainer-agent';

    await mongoose.connect(uri);

    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    return true;
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    console.warn('⚠️  Will use in-memory storage as fallback');
    return false;
  }
}

function isConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectMongoDB, isConnected };
