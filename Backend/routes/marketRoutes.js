import express from 'express';
import {
    getMarketPrices,
    addMarketPrice,
    updateMarketPrice,
    deleteMarketPrice,
    syncMarketData,
    getMarketAnalytics,
    getCropComparison,
    getRealTimePrice,
    getMarketTrend,
    getAdvisoryRecommendation
} from '../controllers/marketController.js';
import adminAuth from '../middleware/adminAuth.js';
import {
    validateMarketQuery,
    marketRateLimiter,
    cacheMiddleware
} from '../middleware/marketMiddleware.js';

const marketRouter = express.Router();

// Public routes - with caching and rate limiting
marketRouter.get('/', marketRateLimiter, validateMarketQuery, cacheMiddleware, getMarketPrices);
marketRouter.get('/analytics', marketRateLimiter, validateMarketQuery, cacheMiddleware, getMarketAnalytics);
marketRouter.get('/comparison/:crop', marketRateLimiter, cacheMiddleware, getCropComparison);
marketRouter.get('/realtime', marketRateLimiter, validateMarketQuery, cacheMiddleware, getRealTimePrice);
marketRouter.get('/trend', marketRateLimiter, validateMarketQuery, cacheMiddleware, getMarketTrend);
marketRouter.get('/recommendation', marketRateLimiter, validateMarketQuery, cacheMiddleware, getAdvisoryRecommendation);

// Admin protected routes
marketRouter.post('/sync', adminAuth, syncMarketData);
marketRouter.post('/', adminAuth, addMarketPrice);
marketRouter.put('/:id', adminAuth, updateMarketPrice);
marketRouter.delete('/:id', adminAuth, deleteMarketPrice);

export default marketRouter;
