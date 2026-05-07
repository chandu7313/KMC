import { successResponse } from '@kissan/shared';
import fertilizerService from '../services/fertilizer.service.js';

export const listFertilizers = async (req, res, next) => {
  try {
    return successResponse(res, { fertilizers: await fertilizerService.listFertilizers(req.query) });
  } catch (e) { next(e); }
};

export const getFertilizer = async (req, res, next) => {
  try {
    return successResponse(res, { fertilizer: await fertilizerService.getFertilizer(req.params.id) });
  } catch (e) { next(e); }
};

export const addFertilizer = async (req, res, next) => {
  try {
    const image = req.file ? req.file.path : req.body.image;
    const fertilizer = await fertilizerService.addFertilizer({ ...req.body, image });
    return successResponse(res, { fertilizer }, 'Fertilizer Added Successfully', 201);
  } catch (e) { next(e); }
};

export const updateFertilizer = async (req, res, next) => {
  try {
    const image = req.file ? req.file.path : req.body.image;
    const fertilizer = await fertilizerService.updateFertilizer(req.params.id, { ...req.body, image });
    return successResponse(res, { fertilizer }, 'Fertilizer Updated Successfully');
  } catch (e) { next(e); }
};

export const removeFertilizer = async (req, res, next) => {
  try {
    await fertilizerService.removeFertilizer(req.params.id);
    return successResponse(res, null, 'Fertilizer Deleted Successfully');
  } catch (e) { next(e); }
};
