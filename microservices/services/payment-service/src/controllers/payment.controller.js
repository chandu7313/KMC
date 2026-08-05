import { successResponse } from '@kissan/shared';
import paymentService from '../services/payment.service.js';

/**
 * Payment Gateway Controller — HTTP endpoints for Razorpay order generation, HMAC verification, refunds, and logs.
 */

/**
 * Initiate Razorpay checkout order with required currency and amount.
 * @route POST /api/payments/create-order
 * @param {import('express').Request} req - Express request with orderId, amount, and currency
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const result = await paymentService.createOrder(userId, req.body.orderId, req.body.amount, req.body.currency);
    return successResponse(res, result, 'Payment order created');
  } catch (e) { next(e); }
};

/**
 * Validate HMAC SHA256 payment signature from Razorpay checkout.
 * @route POST /api/payments/verify
 * @param {import('express').Request} req - Express request with signature and paymentId
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.verifyPayment(req.body);
    return successResponse(res, { payment }, 'Payment verified');
  } catch (e) { next(e); }
};

/**
 * Admin / System: Initiate payment refund via Razorpay API.
 * @route POST /api/payments/refund
 * @param {import('express').Request} req - Express request with paymentId and amount
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const refund = async (req, res, next) => {
  try {
    const result = await paymentService.refund(req.body.paymentId, req.body.amount);
    return successResponse(res, { refund: result }, 'Refund initiated');
  } catch (e) { next(e); }
};

/**
 * Fetch all transaction records for authenticated user.
 * @route GET /api/payments/user/:userId
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getUserPayments = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.params.userId;
    return successResponse(res, { payments: await paymentService.getPaymentsByUser(userId) });
  } catch (e) { next(e); }
};

/**
 * Fetch payment records for a given marketplace order ID.
 * @route GET /api/payments/order/:orderId
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getOrderPayments = async (req, res, next) => {
  try { return successResponse(res, { payments: await paymentService.getPaymentsByOrder(req.params.orderId) }); } catch (e) { next(e); }
};
