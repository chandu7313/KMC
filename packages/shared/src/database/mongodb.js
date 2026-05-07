const mongoose = require('mongoose');
const { logger } = require('../logger/winston');
const config = require('../../config/src/env');

/**
 * MongoDB client wrapper providing a singleton connection instance,
 * connection pooling, reconnection logic, and health checks.
 */
class MongoService {
  constructor() {
    this.uri = config.mongodb.uri;
    
    if (!this.uri) {
      logger.error('MongoDB URI is missing in configuration.');
    }

    this.connection = mongoose.connection;
    this.isConnected = false;

    this._setupEventHandlers();
  }

  /**
   * Set up Mongoose connection event listeners.
   * @private
   */
  _setupEventHandlers() {
    this.connection.on('connected', () => {
      this.isConnected = true;
      logger.info('MongoDB connected successfully');
    });

    this.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`, { error: err });
    });

    this.connection.on('disconnected', () => {
      this.isConnected = false;
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    this.connection.on('reconnected', () => {
      this.isConnected = true;
      logger.info('MongoDB reconnected successfully');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.close();
      logger.info('MongoDB connection closed due to application termination');
      process.exit(0);
    });
  }

  /**
   * Connect to the MongoDB database.
   * Includes connection pooling and auto-reconnect configurations.
   * 
   * @returns {Promise<typeof mongoose>}
   */
  async connect() {
    if (this.isConnected) {
      logger.debug('MongoDB is already connected.');
      return mongoose;
    }

    const options = {
      // Use new URL parser and topology engine (default in Mongoose 6+, but good practice)
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Connection pooling
      maxPoolSize: 10,      // Maintain up to 10 socket connections
      minPoolSize: 2,       // Maintain at least 2 socket connections
      
      // Reconnection logic
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
      family: 4,                      // Use IPv4, skip trying IPv6
    };

    try {
      await mongoose.connect(this.uri, options);
      return mongoose;
    } catch (error) {
      logger.error(`Failed to connect to MongoDB on startup: ${error.message}`);
      throw error; // Fail fast during startup
    }
  }

  /**
   * Health check to verify MongoDB connectivity.
   * 
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      if (this.connection.readyState === 1) {
        // Execute a lightweight ping command
        const admin = this.connection.db.admin();
        const pingResult = await admin.ping();
        return pingResult?.ok === 1;
      }
      return false;
    } catch (error) {
      logger.error(`MongoDB health check failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Gracefully close the MongoDB connection.
   */
  async close() {
    if (this.isConnected || this.connection.readyState !== 0) {
      await mongoose.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Get the active Mongoose instance.
   * 
   * @returns {typeof mongoose}
   */
  getMongoose() {
    return mongoose;
  }
}

// Export a singleton instance
const mongoService = new MongoService();

module.exports = {
  mongoService,
  mongoose, // Also export mongoose directly for schema definitions
};
