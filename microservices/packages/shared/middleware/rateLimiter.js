import { getRateLimitRedis } from '../database/redis.js';
import HttpError from '../errors/HttpError.js';

/**
 * Redis-backed rate limiter middleware factory.
 *
 * @param {object} options
 * @param {number} [options.windowMs=60000] - Time window in milliseconds
 * @param {number} [options.max=100] - Max requests per window
 * @param {string} [options.keyPrefix='rl'] - Redis key prefix
 * @param {Function} [options.keyGenerator] - Custom key generator (req) => string
 * @param {string} [options.message] - Custom error message
 * @returns {Function} Express middleware
 *
 * @example
 * // 100 requests per minute per IP
 * app.use(rateLimiter({ windowMs: 60000, max: 100 }));
 *
 * // 10 OTP requests per hour per phone number
 * app.use('/otp', rateLimiter({ windowMs: 3600000, max: 10, keyPrefix: 'otp' }));
 */
const rateLimiter = (options = {}) => {
  const {
    windowMs = 60 * 1000,
    max = 100,
    keyPrefix = 'rl',
    keyGenerator = null,
    message = 'Too many requests. Please try again later.',
  } = options;

  const windowSec = Math.ceil(windowMs / 1000);

  return async (req, res, next) => {
    try {
      const redis = getRateLimitRedis();

      // Generate key: default is IP-based, can be user-based
      const identifier = keyGenerator
        ? keyGenerator(req)
        : req.user?.id || req.ip || req.connection.remoteAddress;

      const key = `${keyPrefix}:${identifier}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowSec);
      }

      // Set rate limit headers
      const ttl = await redis.ttl(key);
      res.set({
        'X-RateLimit-Limit': String(max),
        'X-RateLimit-Remaining': String(Math.max(0, max - current)),
        'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + ttl),
      });

      if (current > max) {
        res.set('Retry-After', String(ttl));
        return next(HttpError.tooManyRequests(message));
      }

      next();
    } catch (error) {
      // If Redis is down, allow the request through (fail-open)
      console.error('Rate limiter error (failing open):', error.message);
      next();
    }
  };
};

/**
 * Stricter rate limiter for auth endpoints.
 * 5 attempts per 15 minutes per IP.
 */
const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyPrefix: 'rl:auth',
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

/**
 * OTP rate limiter.
 * 3 OTP requests per 10 minutes per phone number.
 */
const otpRateLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 3,
  keyPrefix: 'rl:otp',
  keyGenerator: (req) => req.body?.phone || req.ip,
  message: 'Too many OTP requests. Please wait 10 minutes.',
});

/**
 * API rate limiter per user.
 * 1000 requests per hour.
 */
const userRateLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  keyPrefix: 'rl:user',
  keyGenerator: (req) => req.user?.id || req.ip,
});

export { rateLimiter, authRateLimiter, otpRateLimiter, userRateLimiter };
