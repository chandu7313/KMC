import { successResponse } from '@kissan/shared';
import productService from '../services/product.service.js';

/**
 * Product Catalog Controller — HTTP handlers for browsing and administering agricultural products.
 */

export const listProducts = async (req, res, next) => {
  try { return successResponse(res, { products: await productService.listProducts(req.query) }); } catch (e) { next(e); }
};

export const getProduct = async (req, res, next) => {
  try { return successResponse(res, { product: await productService.getProduct(req.params.id || req.body.productId) }); } catch (e) { next(e); }
};

export const addProduct = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map(f => f.path) : req.body.images || [];
    return successResponse(res, { product: await productService.addProduct({ ...req.body, images }) }, 'Product added', 201);
  } catch (e) { next(e); }
};

export const removeProduct = async (req, res, next) => {
  try { await productService.removeProduct(req.params.id || req.body.id); return successResponse(res, null, 'Product removed'); } catch (e) { next(e); }
};
