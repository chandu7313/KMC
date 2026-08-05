import { successResponse } from '@kissan/shared';
import diseaseService from '../services/disease.service.js';

/**
 * Crop Disease Controller — thin HTTP layer.
 */

/**
 * Handle multipart crop image upload and initiate multimodal pathology diagnosis.
 * @route POST /api/crop-doctor/diagnose
 * @param {import('express').Request} req - Express request with multer uploaded file (req.file)
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON response with diagnosis results
 */
export const diagnoseCrop = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a crop image' });

    const { diagnosis, geminiResult } = await diseaseService.diagnose(userId, req.file.path, req.file.mimetype, req.body);

    return successResponse(res, {
      id: diagnosis.id,
      imageUrl: diagnosis.imageUrl,
      diseaseName: geminiResult.diseaseName,
      scientificName: geminiResult.scientificName,
      confidence: geminiResult.confidence,
      severity: geminiResult.severity,
      description: geminiResult.description,
      cause: geminiResult.cause,
      causeClassification: geminiResult.causeClassification,
      cropName: geminiResult.affectedCrop,
      isHealthy: geminiResult.isHealthy,
      symptoms: geminiResult.symptoms || [],
      treatment: geminiResult.treatment,
      prevention: geminiResult.prevention || [],
      recommendedProducts: geminiResult.recommendedProducts,
      similarDiseases: geminiResult.similarDiseases || [],
      createdAt: diagnosis.created_at,
    }, geminiResult.isHealthy ? 'Your crop looks healthy!' : `Disease detected: ${geminiResult.diseaseName}`);
  } catch (error) { next(error); }
};

/**
 * Retrieve paginated scan history for the authenticated farmer.
 * @route GET /api/crop-doctor/history
 * @param {import('express').Request} req - Authenticated express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON list of historical diagnoses
 */
export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    const data = await diseaseService.getHistory(userId, req.query);
    return successResponse(res, { data }, 'History retrieved');
  } catch (error) { next(error); }
};

/**
 * Retrieve complete diagnosis details by record ID.
 * @route GET /api/crop-doctor/diagnosis/:id
 * @param {import('express').Request} req - Express request with diagnosis ID parameter
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON single diagnosis record
 */
export const getDetail = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    const data = await diseaseService.getDetail(userId, req.params.id);
    return successResponse(res, { data }, 'Detail retrieved');
  } catch (error) { next(error); }
};
