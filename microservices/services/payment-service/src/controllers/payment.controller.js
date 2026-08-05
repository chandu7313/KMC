import { successResponse } from '@kissan/shared';
import paymentService from '../services/payment.service.js';

/**
 * Payment Gateway Controller — HTTP endpoints for Razorpay order generation, HMAC verification, refunds, and logs.
 */

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const result = await paymentService.createOrder(userId, req.body.orderId, req.body.amount, req.body.currency);
    return successResponse(res, result, 'Payment order created');
  } catch (e) { next(e); }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.verifyPayment(req.body);
    return successResponse(res, { payment }, 'Payment verified');
  } catch (e) { next(e); }
};

export const refund = async (req, res, next) => {
  try {
    const result = await paymentService.refund(req.body.paymentId, req.body.amount);
    return successResponse(res, { refund: result }, 'Refund initiated');
  } catch (e) { next(e); }
};

export const getUserPayments = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.params.userId;
    return successResponse(res, { payments: await paymentService.getPaymentsByUser(userId) });
  } catch (e) { next(e); }
};

export const getOrderPayments = async (req, res, next) => {
  try { return successResponse(res, { payments: await paymentService.getPaymentsByOrder(req.params.orderId) }); } catch (e) { next(e); }
};
