import { successResponse } from '@kissan/shared';
import diseaseService from '../services/disease.service.js';

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

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    const data = await diseaseService.getHistory(userId, req.query);
    return successResponse(res, { data }, 'History retrieved');
  } catch (error) { next(error); }
};

export const getDetail = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    const data = await diseaseService.getDetail(userId, req.params.id);
    return successResponse(res, { data }, 'Detail retrieved');
  } catch (error) { next(error); }
};
