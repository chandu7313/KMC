import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connect to MongoDB. Returns the existing connection if already connected.
 * @param {string} [uri] - MongoDB connection string override
 * @returns {Promise<mongoose.Connection>}
 */
const connectMongoDB = async (uri) => {
  if (isConnected) return mongoose.connection;

  const mongoUri = uri || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    isConnected = true;
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.error('MongoDB connection error:', err.message);
  });

  await mongoose.connect(mongoUri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    heartbeatFrequencyMS: 10000,
  });

  return mongoose.connection;
};

/**
 * Gracefully disconnect from MongoDB.
 */
const disconnectMongoDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
};

/**
 * Health check for MongoDB connection.
 * @returns {Promise<{connected: boolean, latency: number}>}
 */
const checkMongoHealth = async () => {
  const start = Date.now();
  try {
    if (!isConnected) return { connected: false, latency: 0 };
    await mongoose.connection.db.admin().ping();
    return { connected: true, latency: Date.now() - start };
  } catch (err) {
    return { connected: false, latency: Date.now() - start, error: err.message };
  }
};

export { connectMongoDB, disconnectMongoDB, checkMongoHealth };
