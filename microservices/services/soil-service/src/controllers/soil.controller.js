import { successResponse } from '@kissan/shared';
import soilService from '../services/soil.service.js';

/**
 * Soil Health & Analysis Controller — HTTP endpoints.
 */

/**
 * Handle submission of a farmer soil test report (via file upload or manual N-P-K metrics).
 * @route POST /api/soil/upload
 * @param {import('express').Request} req - Express request with optional req.file and soil metrics
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON created soil report
 */
export const uploadReport = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    const report = await soilService.uploadReport(userId, req.body, req.file);
    return successResponse(res, { data: report }, 'Report submitted', 201);
  } catch (e) { next(e); }
};

/**
 * Retrieve soil health testing history for the current farmer.
 * @route GET /api/soil/history
 * @param {import('express').Request} req - Authenticated express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON array of user soil reports
 */
export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    const data = await soilService.getHistory(userId);
    return successResponse(res, { count: data.length, data }, 'History retrieved');
  } catch (e) { next(e); }
};

/**
 * Perform algorithmic rule-based soil health calculation without saving to DB.
 * @route POST /api/soil/analyze/standalone
 * @param {import('express').Request} req - Express request with { ph, nitrogen, phosphorus, potassium, organicMatter }
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON analysis and crop suitability
 */
export const analyzeStandalone = async (req, res, next) => {
  try {
    const result = await soilService.analyzeStandalone(req.body);
    return successResponse(res, { data: { soilStatus: result.phStatus, nutrientClassification: result.nutrientClassification, suggestedAction: result.fertilizers, crops: result.crops } });
  } catch (e) { next(e); }
};

/**
 * Perform AI Gemini-powered soil health analysis and recommendations in target language.
 * @route POST /api/soil/analyze/ai
 * @param {import('express').Request} req - Express request with soil metrics and language preference
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON AI-generated recommendations
 */
export const analyzeWithAI = async (req, res, next) => {
  try {
    const result = await soilService.analyzeWithAI(req.body);
    return successResponse(res, { data: result }, 'AI analysis complete');
  } catch (e) { next(e); }
};

/**
 * Admin: Retrieve all farmer soil test reports across the platform.
 * @route GET /api/soil/admin/reports
 * @param {import('express').Request} req - Admin express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON list of all reports
 */
export const adminGetAllReports = async (req, res, next) => {
  try {
    const data = await soilService.adminGetAllReports();
    return successResponse(res, { count: data.length, data });
  } catch (e) { next(e); }
};

/**
 * Admin / Agronomist: Provide manual analysis, nutrient breakdown, and recommendations for a pending report.
 * @route PUT /api/soil/admin/reports/:id/analyze
 * @param {import('express').Request} req - Admin request with report ID and measured NPK data
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON updated report
 */
export const adminAnalyzeReport = async (req, res, next) => {
  try {
    const report = await soilService.adminAnalyzeReport(req.params.id, req.body);
    return successResponse(res, { data: report }, 'Analyzed successfully');
  } catch (e) { next(e); }
};

/**
 * Admin: Directly create a completed soil report for a farmer.
 * @route POST /api/soil/admin/reports
 * @param {import('express').Request} req - Admin request with farmer ID and full metrics
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON created report
 */
export const adminCreateReport = async (req, res, next) => {
  try {
    const report = await soilService.adminCreateReport(req.body);
    return successResponse(res, { data: report }, 'Report created', 201);
  } catch (e) { next(e); }
};

/**
 * Agronomist / Field Agent: Get soil test history for a specific farmer.
 * @route GET /api/soil/farmer/:farmerId/history
 * @param {import('express').Request} req - Request with farmer ID parameter
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON list of farmer's reports
 */
export const getFarmerHistory = async (req, res, next) => {
  try {
    const data = await soilService.getFarmerHistory(req.params.farmerId);
    return successResponse(res, { data });
  } catch (e) { next(e); }
};
