import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as pCtrl from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-order', authenticate, pCtrl.createOrder);
router.post('/verify', authenticate, pCtrl.verifyPayment);
router.get('/user/:userId', authenticate, pCtrl.getUserPayments);
router.get('/order/:orderId', authenticate, pCtrl.getOrderPayments);

// Admin
router.post('/refund', authenticate, authorize(['payment:write']), pCtrl.refund);

export default router;
