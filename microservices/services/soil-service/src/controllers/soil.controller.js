import { successResponse } from '@kissan/shared';
import soilService from '../services/soil.service.js';

export const uploadReport = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    const report = await soilService.uploadReport(userId, req.body, req.file);
    return successResponse(res, { data: report }, 'Report submitted', 201);
  } catch (e) { next(e); }
};

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    const data = await soilService.getHistory(userId);
    return successResponse(res, { count: data.length, data }, 'History retrieved');
  } catch (e) { next(e); }
};

export const analyzeStandalone = async (req, res, next) => {
  try {
    const result = await soilService.analyzeStandalone(req.body);
    return successResponse(res, { data: { soilStatus: result.phStatus, nutrientClassification: result.nutrientClassification, suggestedAction: result.fertilizers, crops: result.crops } });
  } catch (e) { next(e); }
};

export const analyzeWithAI = async (req, res, next) => {
  try {
    const result = await soilService.analyzeWithAI(req.body);
    return successResponse(res, { data: result }, 'AI analysis complete');
  } catch (e) { next(e); }
};

export const adminGetAllReports = async (req, res, next) => {
  try {
    const data = await soilService.adminGetAllReports();
    return successResponse(res, { count: data.length, data });
  } catch (e) { next(e); }
};

export const adminAnalyzeReport = async (req, res, next) => {
  try {
    const report = await soilService.adminAnalyzeReport(req.params.id, req.body);
    return successResponse(res, { data: report }, 'Analyzed successfully');
  } catch (e) { next(e); }
};

export const adminCreateReport = async (req, res, next) => {
  try {
    const report = await soilService.adminCreateReport(req.body);
    return successResponse(res, { data: report }, 'Report created', 201);
  } catch (e) { next(e); }
};

export const getFarmerHistory = async (req, res, next) => {
  try {
    const data = await soilService.getFarmerHistory(req.params.farmerId);
    return successResponse(res, { data });
  } catch (e) { next(e); }
};
