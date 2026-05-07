import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as eoCtrl from '../controllers/equipment-order.controller.js';

const router = express.Router();

// User endpoints
router.post('/place-order', authenticate, eoCtrl.placeOrder);
router.get('/user-orders', authenticate, eoCtrl.userOrders);
router.post('/cancel-order', authenticate, eoCtrl.cancelOrder);

// Admin endpoints
router.get('/admin-orders', authenticate, authorize(['order:read']), eoCtrl.adminOrders);
router.post('/update-status', authenticate, authorize(['order:write']), eoCtrl.updateStatus);

export default router;
