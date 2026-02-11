import express from 'express';
import { getMarketPrices, addMarketPrice, updateMarketPrice, deleteMarketPrice } from '../controllers/marketController.js';
import adminAuth from '../middleware/adminAuth.js';

const marketRouter = express.Router();

// Public route
marketRouter.get('/', getMarketPrices);

// Admin protected routes
marketRouter.post('/', adminAuth, addMarketPrice);
marketRouter.put('/:id', adminAuth, updateMarketPrice);
marketRouter.delete('/:id', adminAuth, deleteMarketPrice);

export default marketRouter;
