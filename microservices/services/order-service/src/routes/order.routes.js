import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as oCtrl from '../controllers/order.controller.js';

const router = express.Router();

// User endpoints
router.post('/place', authenticate, oCtrl.placeOrder);
router.post('/userorders', authenticate, oCtrl.userOrders);
router.post('/cancel', authenticate, oCtrl.cancelOrder);

// Razorpay
router.post('/razorpay', authenticate, oCtrl.placeOrderRazorpay);
router.post('/verify-razorpay', authenticate, oCtrl.verifyRazorpay);

// Admin
router.post('/list', authenticate, authorize(['order:read']), oCtrl.allOrders);
router.post('/status', authenticate, authorize(['order:write']), oCtrl.updateStatus);

export default router;
