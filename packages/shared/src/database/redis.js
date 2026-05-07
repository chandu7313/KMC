const Redis = require('ioredis');
const { logger } = require('../logger/winston');

/**
 * Redis databases by use case as specified.
 */
const DATABASES = {
  AUTH: 0,
  CACHE: 1,
  SESSIONS: 2,
  RATELIMIT: 3,
};

/**
 * Enhanced Redis client wrapper using ioredis.
 * Supports auto-reconnect, error handling, and common operations.
 */
class RedisClient {
  /**
   * Initialize a new Redis Client for a specific database index.
   * 
   * @param {number} dbIndex - The Redis database index (0-15)
   */
  constructor(dbIndex = 0) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    this.client = new Redis(redisUrl, {
      db: dbIndex,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        logger.warn(`Redis [DB:${dbIndex}] reconnecting in ${delay}ms... (Attempt ${times})`);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.client.on('connect', () => {
      logger.info(`Redis [DB:${dbIndex}] connected successfully`);
    });

    this.client.on('error', (err) => {
      logger.error(`Redis [DB:${dbIndex}] connection error: ${err.message}`, { error: err });
    });
  }

  /**
   * Get value by key.
   * 
   * @param {string} key 
   * @returns {Promise<string|null>}
   */
  async get(key) {
    return this.client.get(key);
  }

  /**
   * Set value by key with optional TTL.
   * 
   * @param {string} key 
   * @param {string} value 
   * @param {number} [ttlSeconds] 
   * @returns {Promise<string>}
   */
  async set(key, value, ttlSeconds) {
    if (ttlSeconds) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }
    return this.client.set(key, value);
  }

  /**
   * Delete value by key.
   * 
   * @param {string} key 
   * @returns {Promise<number>}
   */
  async del(key) {
    return this.client.del(key);
  }

  /**
   * Check if key exists.
   * 
   * @param {string} key 
   * @returns {Promise<boolean>}
   */
  async exists(key) {
    const result = await this.client.exists(key);
    return result === 1;
  }

  /**
   * Set value with explicit TTL.
   * 
   * @param {string} key 
   * @param {number} ttl 
   * @param {string} value 
   * @returns {Promise<string>}
   */
  async setEx(key, ttl, value) {
    return this.client.setex(key, ttl, value);
  }

  /**
   * Parse JSON value from key.
   * 
   * @param {string} key 
   * @returns {Promise<Object|null>}
   */
  async getJson(key) {
    const data = await this.client.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (err) {
      logger.error(`Redis JSON parse error for key ${key}: ${err.message}`);
      return null;
    }
  }

  /**
   * Stringify object and set to key with optional TTL.
   * 
   * @param {string} key 
   * @param {Object} value 
   * @param {number} [ttl] 
   * @returns {Promise<string>}
   */
  async setJson(key, value, ttl) {
    const stringValue = JSON.stringify(value);
    return this.set(key, stringValue, ttl);
  }

  /**
   * Increment integer value by 1.
   * 
   * @param {string} key 
   * @returns {Promise<number>}
   */
  async increment(key) {
    return this.client.incr(key);
  }

  /**
   * Set expiration in seconds for a key.
   * 
   * @param {string} key 
   * @param {number} seconds 
   * @returns {Promise<number>}
   */
  async expire(key, seconds) {
    return this.client.expire(key, seconds);
  }

  /**
   * Health check method to ping Redis.
   * 
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (err) {
      logger.error(`Redis health check failed: ${err.message}`);
      return false;
    }
  }

  /**
   * Safely close the Redis connection.
   */
  async close() {
    await this.client.quit();
  }
}

// Instantiate specific clients based on use cases
const authRedis = new RedisClient(DATABASES.AUTH);
const cacheRedis = new RedisClient(DATABASES.CACHE);
const sessionsRedis = new RedisClient(DATABASES.SESSIONS);
const rateLimitRedis = new RedisClient(DATABASES.RATELIMIT);

module.exports = {
  RedisClient,
  authRedis,
  cacheRedis,
  sessionsRedis,
  rateLimitRedis,
  DATABASES,
};
