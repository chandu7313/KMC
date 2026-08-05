import { successResponse } from '@kissan/shared';
import marketService from '../services/market.service.js';
import datagovService from '../services/datagov.service.js';

/**
 * Market Price Controller — HTTP handlers for mandi prices, trends, comparisons, and recommendations.
 */

/**
 * Retrieve filtered list of mandi prices (by crop, district).
 * @route GET /api/market/prices
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getPrices = async (req, res, next) => {
  try { return successResponse(res, { prices: await marketService.getPrices(req.query) }); } catch (e) { next(e); }
};

/**
 * Retrieve top recent mandi prices for dashboard display.
 * @route GET /api/market/prices/dashboard
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getDashboardPrices = async (req, res, next) => {
  try { return successResponse(res, { prices: await marketService.getDashboardPrices(req.query.state, req.query.limit) }); } catch (e) { next(e); }
};

/**
 * Admin: Add a new mandi price entry.
 * @route POST /api/market/prices
 * @param {import('express').Request} req - Admin express request with price details
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const addPrice = async (req, res, next) => {
  try { return successResponse(res, { price: await marketService.addPrice(req.body) }, 'Market price added', 201); } catch (e) { next(e); }
};

/**
 * Admin: Update an existing mandi price entry.
 * @route PUT /api/market/prices/:id
 * @param {import('express').Request} req - Admin express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const updatePrice = async (req, res, next) => {
  try { return successResponse(res, { price: await marketService.updatePrice(req.params.id, req.body) }, 'Updated'); } catch (e) { next(e); }
};

/**
 * Admin: Delete a mandi price entry.
 * @route DELETE /api/market/prices/:id
 * @param {import('express').Request} req - Admin express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const deletePrice = async (req, res, next) => {
  try { await marketService.deletePrice(req.params.id); return successResponse(res, null, 'Deleted'); } catch (e) { next(e); }
};

/**
 * Compare price across different mandis for a given crop.
 * @route GET /api/market/prices/compare/:crop
 * @param {import('express').Request} req - Express request with crop param
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getCropComparison = async (req, res, next) => {
  try { return successResponse(res, { prices: await marketService.getCropComparison(req.params.crop) }); } catch (e) { next(e); }
};

/**
 * Get latest recorded price for crop in a specific district.
 * @route GET /api/market/prices/realtime
 * @param {import('express').Request} req - Express request with query { crop, district }
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getRealTimePrice = async (req, res, next) => {
  try { return successResponse(res, { data: await marketService.getRealTimePrice(req.query.crop, req.query.district) }); } catch (e) { next(e); }
};

/**
 * Calculate 30-day price trend and momentum.
 * @route GET /api/market/prices/trend
 * @param {import('express').Request} req - Express request with { crop, district }
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getTrend = async (req, res, next) => {
  try { return successResponse(res, await marketService.getTrend(req.query.crop, req.query.district)); } catch (e) { next(e); }
};

/**
 * Generate actionable buy/sell recommendation based on price trends.
 * @route GET /api/market/prices/recommendation
 * @param {import('express').Request} req - Express request with { crop, district }
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getRecommendation = async (req, res, next) => {
  try { return successResponse(res, await marketService.getRecommendation(req.query.crop, req.query.district)); } catch (e) { next(e); }
};

/**
 * Comprehensive market analytics: combining trends and buy/sell recommendations.
 * @route GET /api/market/prices/analytics
 * @param {import('express').Request} req - Express request with { crop, district }
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const trend = await marketService.getTrend(req.query.crop, req.query.district);
    const rec = await marketService.getRecommendation(req.query.crop, req.query.district);
    return successResponse(res, { crop: req.query.crop, district: req.query.district, trends: trend, recommendation: rec });
  } catch (e) { next(e); }
};

/**
 * Trigger sync of live mandi prices from Data.gov.in API.
 * @route POST /api/market/prices/sync
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const syncData = async (req, res, next) => {
  try {
    const result = await datagovService.syncMarketPrices();
    return successResponse(res, result, 'Market prices synced successfully');
  } catch (e) { next(e); }
};
