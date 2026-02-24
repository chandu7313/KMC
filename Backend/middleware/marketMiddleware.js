import { query, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';

// Initialize cache: 30 minutes stdTTL
const marketCache = new NodeCache({ stdTTL: 1800, checkperiod: 600 });

/**
 * Validates crop and district query parameters
 */
export const validateMarketQuery = [
    query('crop').optional().isString().trim().escape().withMessage('Crop must be a string'),
    query('district').optional().isString().trim().escape().withMessage('District must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

/**
 * Rate limiter for Market APIs: 100 requests per 15 minutes per IP
 */
export const marketRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Caching middleware for Market responses
 */
export const cacheMiddleware = (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') return next();

    const key = req.originalUrl || req.url;
    const cachedResponse = marketCache.get(key);

    if (cachedResponse) {
        console.log(`Cache Hit for: ${key}`);
        return res.json(cachedResponse);
    }

    // Override res.json to store the response in cache before sending
    const originalJson = res.json;
    res.json = (body) => {
        if (body && body.success !== false) {
            marketCache.set(key, body);
        }
        return originalJson.call(res, body);
    };

    next();
};

/**
 * Clear specific cache key (useful after admin updates)
 */
export const clearMarketCache = (pattern) => {
    const keys = marketCache.keys();
    const keysToRemove = keys.filter(key => key.includes(pattern));
    marketCache.del(keysToRemove);
    console.log(`Cleared ${keysToRemove.length} cache keys for pattern: ${pattern}`);
};
