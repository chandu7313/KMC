import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as mCtrl from '../controllers/market.controller.js';

const router = express.Router();

// Public
router.get('/prices', mCtrl.getPrices);
router.get('/realtime', mCtrl.getRealTimePrice);
router.get('/trend', mCtrl.getTrend);
router.get('/recommendation', mCtrl.getRecommendation);
router.get('/analytics', mCtrl.getAnalytics);
router.get('/compare/:crop', mCtrl.getCropComparison);
router.post('/sync', mCtrl.syncData);

// Admin
router.post('/prices', authenticate, authorize(['market:write']), mCtrl.addPrice);
router.put('/prices/:id', authenticate, authorize(['market:write']), mCtrl.updatePrice);
router.delete('/prices/:id', authenticate, authorize(['market:write']), mCtrl.deletePrice);

export default router;
