import { successResponse } from '@kissan/shared';
import fertilizerOrderService from '../services/fertilizer-order.service.js';

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const order = await fertilizerOrderService.placeOrder(userId, req.body);
    return successResponse(res, { order }, 'Order Placed Successfully', 201);
  } catch (e) { next(e); }
};

export const userOrders = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    return successResponse(res, { orders: await fertilizerOrderService.userOrders(userId) });
  } catch (e) { next(e); }
};

export const adminOrders = async (req, res, next) => {
  try {
    return successResponse(res, { orders: await fertilizerOrderService.adminOrders() });
  } catch (e) { next(e); }
};

export const updateStatus = async (req, res, next) => {
  try {
    const result = await fertilizerOrderService.updateStatus(req.body.orderId, req.body.status);
    return successResponse(res, result, 'Order Status Updated');
  } catch (e) { next(e); }
};
