const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("hello")
    await mongoose.connect('mongodb://localhost:27017/taskmanagement');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
