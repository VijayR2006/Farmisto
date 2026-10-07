const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI from environment variables.
 * The app should still start cleanly when the runtime DB credentials are absent
 * or invalid so the health endpoint can report the DB state instead of crashing.
 */
const MongooseConnect = async (options = {}) => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI is not defined in environment variables. MongoDB connectivity is unavailable until the backend .env file is configured.');
    return null;
  }

  const connOptions = {
    serverSelectionTimeoutMS: 5000,
    ...options,
  };

  try {
    await mongoose.connect(uri, connOptions);
    console.log('MongoDB connected successfully');

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

    return mongoose;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    return null;
  }
};

module.exports = MongooseConnect;