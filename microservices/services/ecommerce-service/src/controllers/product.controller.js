import { successResponse } from '@kissan/shared';
import productService from '../services/product.service.js';

/**
 * Product Catalog Controller — HTTP handlers for browsing and administering agricultural products.
 */

/**
 * List products with optional category, search, or pagination filters.
 * @route GET /api/products
 * @param {import('express').Request} req - Express request with query filters
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const listProducts = async (req, res, next) => {
  try { return successResponse(res, { products: await productService.listProducts(req.query) }); } catch (e) { next(e); }
};

/**
 * Retrieve single product by UUID.
 * @route GET /api/products/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getProduct = async (req, res, next) => {
  try { return successResponse(res, { product: await productService.getProduct(req.params.id || req.body.productId) }); } catch (e) { next(e); }
};

/**
 * Admin: Create a new product entry in catalog.
 * @route POST /api/products
 * @param {import('express').Request} req - Admin express request with optional file uploads
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const addProduct = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map(f => f.path) : req.body.images || [];
    return successResponse(res, { product: await productService.addProduct({ ...req.body, images }) }, 'Product added', 201);
  } catch (e) { next(e); }
};

/**
 * Admin: Delete product from catalog.
 * @route DELETE /api/products/:id
 * @param {import('express').Request} req - Admin express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const removeProduct = async (req, res, next) => {
  try { await productService.removeProduct(req.params.id || req.body.id); return successResponse(res, null, 'Product removed'); } catch (e) { next(e); }
};
