const { rateLimitRedis } = require('../database/redis');
const HttpError = require('../errors/HttpError');

/**
 * Redis-based rate limiting middleware factory.
 * 
 * @param {Object} options 
 * @param {string} options.prefix - Redis key prefix (e.g., 'global', 'auth')
 * @param {number} options.max - Max requests allowed
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {Function} [options.keyGenerator] - Function to generate the unique identifier
 */
const createRateLimiter = ({ prefix, max, windowMs, keyGenerator }) => {
  return async (req, res, next) => {
    try {
      const identifier = keyGenerator ? keyGenerator(req) : (req.ip || req.connection.remoteAddress);
      const redisKey = `rate:${prefix}:${identifier}`;

      // Increment the count for this key
      const currentCount = await rateLimitRedis.increment(redisKey);

      // If it's the first request, set the expiration window
      if (currentCount === 1) {
        await rateLimitRedis.expire(redisKey, Math.ceil(windowMs / 1000));
      }

      // Calculate remaining requests
      const remaining = Math.max(0, max - currentCount);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', remaining);

      if (currentCount > max) {
        throw HttpError.tooManyRequests();
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Pre-configured global rate limiter (100 req / minute per IP)
 */
const globalLimiter = createRateLimiter({
  prefix: 'global',
  max: 100,
  windowMs: 60 * 1000, // 1 minute
});

/**
 * Auth endpoints rate limiter (10 req / 15 minutes per IP)
 */
const authLimiter = createRateLimiter({
  prefix: 'auth',
  max: 10,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

/**
 * API rate limiter (1000 req / hour per User ID)
 */
const apiLimiter = createRateLimiter({
  prefix: 'api',
  max: 1000,
  windowMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (req) => req.user?.id || req.ip,
});

/**
 * OTP request rate limiter (3 req / 10 minutes per Phone number)
 */
const otpLimiter = createRateLimiter({
  prefix: 'otp',
  max: 3,
  windowMs: 10 * 60 * 1000, // 10 minutes
  keyGenerator: (req) => req.body?.phone || req.ip,
});

/**
 * File upload rate limiter (20 uploads / hour per User ID)
 */
const uploadLimiter = createRateLimiter({
  prefix: 'upload',
  max: 20,
  windowMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (req) => req.user?.id || req.ip,
});

module.exports = {
  globalLimiter,
  authLimiter,
  apiLimiter,
  otpLimiter,
  uploadLimiter,
  createRateLimiter, // Export factory for custom limiters
};
