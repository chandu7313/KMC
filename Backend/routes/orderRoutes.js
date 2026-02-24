import express from 'express';
import { placeOrder, userOrders, allOrders, updateStatus, placeOrderRazorpay, verifyRazorpay, cancelOrder } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// User Features
orderRouter.post('/place', userAuth, placeOrder);
orderRouter.post('/razorpay', userAuth, placeOrderRazorpay);
orderRouter.post('/verifyRazorpay', userAuth, verifyRazorpay);
orderRouter.post('/userorders', userAuth, userOrders);
orderRouter.post('/cancel', userAuth, cancelOrder);

export default orderRouter;
