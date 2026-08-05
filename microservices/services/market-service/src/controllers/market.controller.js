import { successResponse } from '@kissan/shared';
import marketService from '../services/market.service.js';
import datagovService from '../services/datagov.service.js';

/**
 * Market Price Controller — HTTP handlers for mandi prices, trends, comparisons, and recommendations.
 */

export const getPrices = async (req, res, next) => {
  try { return successResponse(res, { prices: await marketService.getPrices(req.query) }); } catch (e) { next(e); }
};

export const getDashboardPrices = async (req, res, next) => {
  try { return successResponse(res, { prices: await marketService.getDashboardPrices(req.query.state, req.query.limit) }); } catch (e) { next(e); }
};

export const addPrice = async (req, res, next) => {
  try { return successResponse(res, { price: await marketService.addPrice(req.body) }, 'Market price added', 201); } catch (e) { next(e); }
};

export const updatePrice = async (req, res, next) => {
  try { return successResponse(res, { price: await marketService.updatePrice(req.params.id, req.body) }, 'Updated'); } catch (e) { next(e); }
};

export const deletePrice = async (req, res, next) => {
  try { await marketService.deletePrice(req.params.id); return successResponse(res, null, 'Deleted'); } catch (e) { next(e); }
};

export const getCropComparison = async (req, res, next) => {
  try { return successResponse(res, { prices: await marketService.getCropComparison(req.params.crop) }); } catch (e) { next(e); }
};

export const getRealTimePrice = async (req, res, next) => {
  try { return successResponse(res, { data: await marketService.getRealTimePrice(req.query.crop, req.query.district) }); } catch (e) { next(e); }
};

export const getTrend = async (req, res, next) => {
  try { return successResponse(res, await marketService.getTrend(req.query.crop, req.query.district)); } catch (e) { next(e); }
};

export const getRecommendation = async (req, res, next) => {
  try { return successResponse(res, await marketService.getRecommendation(req.query.crop, req.query.district)); } catch (e) { next(e); }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const trend = await marketService.getTrend(req.query.crop, req.query.district);
    const rec = await marketService.getRecommendation(req.query.crop, req.query.district);
    return successResponse(res, { crop: req.query.crop, district: req.query.district, trends: trend, recommendation: rec });
  } catch (e) { next(e); }
};

export const syncData = async (req, res, next) => {
  try {
    const result = await datagovService.syncMarketPrices();
    return successResponse(res, result, 'Market prices synced successfully');
  } catch (e) { next(e); }
};
