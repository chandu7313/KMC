import Redis from 'ioredis';

const clients = new Map();

/**
 * Get or create a Redis client for a specific database.
 * @param {number} [db=0] - Redis database number (0-3)
 * @param {object} [options] - Override options
 * @returns {Redis}
 */
const getRedisClient = (db = 0, options = {}) => {
  const key = `redis-db-${db}`;
  if (clients.has(key)) return clients.get(key);

  const redisUrl = options.url || process.env.REDIS_URL || 'redis://localhost:6379';

  const client = new Redis(redisUrl, {
    db,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 10) return null; // Stop retrying after 10 attempts
      return Math.min(times * 200, 3000);
    },
    lazyConnect: false,
    enableReadyCheck: true,
    connectTimeout: 5000,
    ...options,
  });

  client.on('error', (err) => {
    console.error(`Redis DB${db} error:`, err.message);
  });

  client.on('connect', () => {
    console.info(`Redis DB${db} connected`);
  });

  clients.set(key, client);
  return client;
};

/**
 * Redis database assignments as per architecture spec.
 */
const REDIS_DBS = {
  AUTH_SESSIONS: 0,    // Auth + Sessions
  CART_ECOMMERCE: 1,   // Cart + E-Commerce
  CACHE: 2,            // Market prices, products, AI results
  RATE_LIMITING: 3,    // Rate limiting counters
};

/**
 * Convenience getters for each Redis database.
 */
const getAuthRedis = (options) => getRedisClient(REDIS_DBS.AUTH_SESSIONS, options);
const getCartRedis = (options) => getRedisClient(REDIS_DBS.CART_ECOMMERCE, options);
const getCacheRedis = (options) => getRedisClient(REDIS_DBS.CACHE, options);
const getRateLimitRedis = (options) => getRedisClient(REDIS_DBS.RATE_LIMITING, options);

/**
 * Health check for Redis.
 * @param {number} [db=0]
 * @returns {Promise<{connected: boolean, latency: number}>}
 */
const checkRedisHealth = async (db = 0) => {
  const start = Date.now();
  try {
    const client = getRedisClient(db);
    await client.ping();
    return { connected: true, latency: Date.now() - start };
  } catch (err) {
    return { connected: false, latency: Date.now() - start, error: err.message };
  }
};

/**
 * Gracefully disconnect all Redis clients.
 */
const disconnectAllRedis = async () => {
  for (const [key, client] of clients) {
    await client.quit();
    clients.delete(key);
  }
};

export {
  getRedisClient,
  REDIS_DBS,
  getAuthRedis,
  getCartRedis,
  getCacheRedis,
  getRateLimitRedis,
  checkRedisHealth,
  disconnectAllRedis,
};
