import { successResponse } from '@kissan/shared';
import orderService from '../services/order.service.js';

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const order = await orderService.placeOrder(userId, req.body);
    return successResponse(res, { order }, 'Order placed', 201);
  } catch (e) { next(e); }
};

export const userOrders = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    return successResponse(res, { orders: await orderService.userOrders(userId) });
  } catch (e) { next(e); }
};

export const allOrders = async (req, res, next) => {
  try { return successResponse(res, { orders: await orderService.allOrders() }); } catch (e) { next(e); }
};

export const updateStatus = async (req, res, next) => {
  try { return successResponse(res, await orderService.updateStatus(req.body.orderId, req.body.status), 'Status updated'); } catch (e) { next(e); }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    return successResponse(res, await orderService.cancelOrder(userId, req.body.orderId, req.body.reason), 'Order cancelled');
  } catch (e) { next(e); }
};

export const placeOrderRazorpay = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const order = await orderService.saveRazorpayOrder(userId, req.body);
    return successResponse(res, { dbOrderId: order.id }, 'Razorpay order created');
  } catch (e) { next(e); }
};

export const verifyRazorpay = async (req, res, next) => {
  try {
    const { dbOrderId, razorpay_payment_id, razorpay_signature } = req.body;
    await orderService.confirmPayment(dbOrderId, { razorpay_payment_id, razorpay_signature });
    return successResponse(res, null, 'Payment successful');
  } catch (e) { next(e); }
};
