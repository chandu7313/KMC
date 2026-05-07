import { successResponse } from '@kissan/shared';
import cartService from '../services/cart.service.js';

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    return successResponse(res, { cartData: await cartService.getCart(userId) });
  } catch (e) { next(e); }
};
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    await cartService.addToCart(userId, req.body.itemId);
    return successResponse(res, null, 'Added to cart');
  } catch (e) { next(e); }
};
export const updateCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    await cartService.updateCart(userId, req.body.itemId, req.body.quantity);
    return successResponse(res, null, 'Cart updated');
  } catch (e) { next(e); }
};
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    await cartService.clearCart(userId);
    return successResponse(res, null, 'Cart cleared');
  } catch (e) { next(e); }
};
