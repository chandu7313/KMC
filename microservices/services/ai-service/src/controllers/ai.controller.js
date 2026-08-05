import { successResponse, HttpError, createLogger } from '@kissan/shared';
import * as geminiService from '../services/gemini.service.js';
import * as plantIdService from '../services/plantid.service.js';

const logger = createLogger('ai-service');

/**
 * AI Service Controller — Handles routing for LLM text analysis, vision reasoning, and crop disease detection.
 */

/**
 * Execute text-based prompt inference using Google Gemini with fallback model chain.
 * @route POST /api/ai/analyze/text
 * @param {import('express').Request} req - Express request containing { prompt: string, json?: boolean }
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON response with generated text/object
 */
export const analyzeText = async (req, res, next) => {
  try {
    const { prompt, json } = req.body;
    if (!prompt) throw HttpError.badRequest('prompt is required');

    const result = await geminiService.generateFromText(prompt, { json: json !== false });
    return successResponse(res, { result }, 'AI analysis complete');
  } catch (error) {
    next(error);
  }
};

/**
 * Execute multimodal vision prompt inference on image data (base64).
 * @route POST /api/ai/analyze/image
 * @param {import('express').Request} req - Express request containing { prompt: string, image: string, mimeType?: string, json?: boolean }
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON response with vision analysis
 */
export const analyzeImage = async (req, res, next) => {
  try {
    const { prompt, image, mimeType, json } = req.body;
    if (!prompt || !image) throw HttpError.badRequest('prompt and image (base64) are required');

    const result = await geminiService.generateFromImage(prompt, image, mimeType || 'image/jpeg', { json: json !== false });
    return successResponse(res, { result }, 'Vision analysis complete');
  } catch (error) {
    next(error);
  }
};

/**
 * Perform specialized plant and disease identification using Plant.id API.
 * @route POST /api/ai/detect/plant
 * @param {import('express').Request} req - Express request containing { image: string } (base64)
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON response with diagnosis results
 */
export const detectPlantDisease = async (req, res, next) => {
  try {
    const { image } = req.body;
    if (!image) throw HttpError.badRequest('image (base64) is required');

    const result = await plantIdService.detectDiseaseWithPlantId(image);
    return successResponse(res, result, 'Plant detection complete');
  } catch (error) {
    next(error);
  }
};
