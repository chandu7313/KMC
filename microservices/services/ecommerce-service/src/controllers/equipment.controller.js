import { successResponse } from '@kissan/shared';
import equipmentService from '../services/equipment.service.js';

export const listEquipments = async (req, res, next) => {
  try {
    return successResponse(res, { equipments: await equipmentService.listEquipments(req.query) });
  } catch (e) { next(e); }
};

export const getEquipment = async (req, res, next) => {
  try {
    return successResponse(res, { equipment: await equipmentService.getEquipment(req.params.id) });
  } catch (e) { next(e); }
};

export const addEquipment = async (req, res, next) => {
  try {
    const image = req.file ? req.file.path : req.body.image;
    const equipment = await equipmentService.addEquipment({ ...req.body, image });
    return successResponse(res, { equipment }, 'Equipment Added Successfully', 201);
  } catch (e) { next(e); }
};

export const updateEquipment = async (req, res, next) => {
  try {
    const image = req.file ? req.file.path : req.body.image;
    const equipment = await equipmentService.updateEquipment(req.params.id, { ...req.body, image });
    return successResponse(res, { equipment }, 'Equipment Updated Successfully');
  } catch (e) { next(e); }
};

export const removeEquipment = async (req, res, next) => {
  try {
    await equipmentService.removeEquipment(req.params.id);
    return successResponse(res, null, 'Equipment Deleted Successfully');
  } catch (e) { next(e); }
};
