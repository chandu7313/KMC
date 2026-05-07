import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as foCtrl from '../controllers/fertilizer-order.controller.js';

const router = express.Router();

// User endpoints
router.post('/place-order', authenticate, foCtrl.placeOrder);
router.get('/user-orders', authenticate, foCtrl.userOrders);

// Admin endpoints
router.get('/admin-orders', authenticate, authorize(['order:read']), foCtrl.adminOrders);
router.post('/update-status', authenticate, authorize(['order:write']), foCtrl.updateStatus);

export default router;
