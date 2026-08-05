import { successResponse } from '@kissan/shared';
import cartService from '../services/cart.service.js';

/**
 * Shopping Cart Controller — HTTP endpoints for user carts.
 */

/**
 * Retrieve user's active shopping cart items and quantities.
 * @route GET /api/cart
 * @param {import('express').Request} req - Authenticated express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    return successResponse(res, { cartData: await cartService.getCart(userId) });
  } catch (e) { next(e); }
};

/**
 * Add product item to user's cart.
 * @route POST /api/cart/add
 * @param {import('express').Request} req - Express request with { itemId }
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    await cartService.addToCart(userId, req.body.itemId);
    return successResponse(res, null, 'Added to cart');
  } catch (e) { next(e); }
};

/**
 * Update item quantity in shopping cart.
 * @route POST /api/cart/update
 * @param {import('express').Request} req - Express request with { itemId, quantity }
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const updateCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    await cartService.updateCart(userId, req.body.itemId, req.body.quantity);
    return successResponse(res, null, 'Cart updated');
  } catch (e) { next(e); }
};

/**
 * Empty all items from user's shopping cart.
 * @route POST /api/cart/clear
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    await cartService.clearCart(userId);
    return successResponse(res, null, 'Cart cleared');
  } catch (e) { next(e); }
};
