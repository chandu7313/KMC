import { successResponse } from '@kissan/shared';
import equipmentService from '../services/equipment.service.js';

/**
 * Equipment Controller — HTTP handlers for agricultural machinery and rentals.
 */

/**
 * List agricultural equipment with optional filters.
 * @route GET /api/equipments
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const listEquipments = async (req, res, next) => {
  try {
    return successResponse(res, { equipments: await equipmentService.listEquipments(req.query) });
  } catch (e) { next(e); }
};

/**
 * Get equipment details by ID.
 * @route GET /api/equipments/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getEquipment = async (req, res, next) => {
  try {
    return successResponse(res, { equipment: await equipmentService.getEquipment(req.params.id) });
  } catch (e) { next(e); }
};

/**
 * Admin / Vendor: Add new machinery or farm tool.
 * @route POST /api/equipments
 * @param {import('express').Request} req - Admin express request with optional file
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const addEquipment = async (req, res, next) => {
  try {
    const image = req.file ? req.file.path : req.body.image;
    const equipment = await equipmentService.addEquipment({ ...req.body, image });
    return successResponse(res, { equipment }, 'Equipment Added Successfully', 201);
  } catch (e) { next(e); }
};

/**
 * Admin / Vendor: Update equipment details.
 * @route PUT /api/equipments/:id
 * @param {import('express').Request} req - Admin express request with optional file
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const updateEquipment = async (req, res, next) => {
  try {
    const image = req.file ? req.file.path : req.body.image;
    const equipment = await equipmentService.updateEquipment(req.params.id, { ...req.body, image });
    return successResponse(res, { equipment }, 'Equipment Updated Successfully');
  } catch (e) { next(e); }
};

/**
 * Admin / Vendor: Remove equipment listing.
 * @route DELETE /api/equipments/:id
 * @param {import('express').Request} req - Admin express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const removeEquipment = async (req, res, next) => {
  try {
    await equipmentService.removeEquipment(req.params.id);
    return successResponse(res, null, 'Equipment Deleted Successfully');
  } catch (e) { next(e); }
};
