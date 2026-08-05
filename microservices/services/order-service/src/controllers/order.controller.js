import { successResponse } from '@kissan/shared';
import orderService from '../services/order.service.js';

/**
 * Marketplace Order Controller — HTTP endpoints for placing orders, tracking status, Razorpay integration, and cancellations.
 */

/**
 * Place a new COD or prepaid marketplace order.
 * @route POST /api/orders
 * @param {import('express').Request} req - Express request with order payload (items, amount, address)
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const order = await orderService.placeOrder(userId, req.body);
    return successResponse(res, { order }, 'Order placed', 201);
  } catch (e) { next(e); }
};

/**
 * Get list of marketplace orders for authenticated user.
 * @route GET /api/orders/my-orders
 * @param {import('express').Request} req - Authenticated express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const userOrders = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    return successResponse(res, { orders: await orderService.userOrders(userId) });
  } catch (e) { next(e); }
};

/**
 * Admin: List all marketplace orders across users.
 * @route GET /api/orders/admin/all
 * @param {import('express').Request} req - Admin express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const allOrders = async (req, res, next) => {
  try { return successResponse(res, { orders: await orderService.allOrders() }); } catch (e) { next(e); }
};

/**
 * Admin / Operations: Update order fulfillment status (e.g. Processing, Shipped, Delivered).
 * @route PUT /api/orders/status
 * @param {import('express').Request} req - Express request with { orderId, status }
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const updateStatus = async (req, res, next) => {
  try { return successResponse(res, await orderService.updateStatus(req.body.orderId, req.body.status), 'Status updated'); } catch (e) { next(e); }
};

/**
 * Cancel a pending order by customer.
 * @route POST /api/orders/cancel
 * @param {import('express').Request} req - Express request with { orderId, reason }
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    return successResponse(res, await orderService.cancelOrder(userId, req.body.orderId, req.body.reason), 'Order cancelled');
  } catch (e) { next(e); }
};

/**
 * Initiate Razorpay checkout order creation.
 * @route POST /api/orders/razorpay
 * @param {import('express').Request} req - Express request with order items and amount
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const placeOrderRazorpay = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const order = await orderService.saveRazorpayOrder(userId, req.body);
    return successResponse(res, { dbOrderId: order.id }, 'Razorpay order created');
  } catch (e) { next(e); }
};

/**
 * Verify Razorpay payment signature and confirm order.
 * @route POST /api/orders/verify
 * @param {import('express').Request} req - Express request with payment signature
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const verifyRazorpay = async (req, res, next) => {
  try {
    const { dbOrderId, razorpay_payment_id, razorpay_signature } = req.body;
    await orderService.confirmPayment(dbOrderId, { razorpay_payment_id, razorpay_signature });
    return successResponse(res, null, 'Payment successful');
  } catch (e) { next(e); }
};
