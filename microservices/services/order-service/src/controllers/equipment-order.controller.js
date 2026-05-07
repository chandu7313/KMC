import { successResponse } from '@kissan/shared';
import equipmentOrderService from '../services/equipment-order.service.js';

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const order = await equipmentOrderService.placeOrder(userId, req.body);
    return successResponse(res, { order }, 'Equipment Order Placed Successfully', 201);
  } catch (e) { next(e); }
};

export const userOrders = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    return successResponse(res, { orders: await equipmentOrderService.userOrders(userId) });
  } catch (e) { next(e); }
};

export const adminOrders = async (req, res, next) => {
  try {
    return successResponse(res, { orders: await equipmentOrderService.adminOrders() });
  } catch (e) { next(e); }
};

export const updateStatus = async (req, res, next) => {
  try {
    const result = await equipmentOrderService.updateStatus(req.body.orderId, req.body.status);
    return successResponse(res, result, 'Equipment Order Status Updated');
  } catch (e) { next(e); }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const result = await equipmentOrderService.cancelOrder(userId, req.body.orderId, req.body.reason);
    return successResponse(res, result, 'Order Cancelled Successfully');
  } catch (e) { next(e); }
};
