import { successResponse } from '@kissan/shared';
import fertilizerService from '../services/fertilizer.service.js';

/**
 * Fertilizer Controller — HTTP handlers for fertilizer catalog.
 */

/**
 * List fertilizers with optional type or name filtering.
 * @route GET /api/fertilizers
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const listFertilizers = async (req, res, next) => {
  try {
    return successResponse(res, { fertilizers: await fertilizerService.listFertilizers(req.query) });
  } catch (e) { next(e); }
};

/**
 * Get fertilizer details by ID.
 * @route GET /api/fertilizers/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getFertilizer = async (req, res, next) => {
  try {
    return successResponse(res, { fertilizer: await fertilizerService.getFertilizer(req.params.id) });
  } catch (e) { next(e); }
};

/**
 * Admin: Add a new fertilizer product.
 * @route POST /api/fertilizers
 * @param {import('express').Request} req - Admin express request with optional file
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const addFertilizer = async (req, res, next) => {
  try {
    const image = req.file ? req.file.path : req.body.image;
    const fertilizer = await fertilizerService.addFertilizer({ ...req.body, image });
    return successResponse(res, { fertilizer }, 'Fertilizer Added Successfully', 201);
  } catch (e) { next(e); }
};

/**
 * Admin: Update fertilizer product.
 * @route PUT /api/fertilizers/:id
 * @param {import('express').Request} req - Admin express request with optional file
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const updateFertilizer = async (req, res, next) => {
  try {
    const image = req.file ? req.file.path : req.body.image;
    const fertilizer = await fertilizerService.updateFertilizer(req.params.id, { ...req.body, image });
    return successResponse(res, { fertilizer }, 'Fertilizer Updated Successfully');
  } catch (e) { next(e); }
};

/**
 * Admin: Remove fertilizer product.
 * @route DELETE /api/fertilizers/:id
 * @param {import('express').Request} req - Admin express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const removeFertilizer = async (req, res, next) => {
  try {
    await fertilizerService.removeFertilizer(req.params.id);
    return successResponse(res, null, 'Fertilizer Deleted Successfully');
  } catch (e) { next(e); }
};
