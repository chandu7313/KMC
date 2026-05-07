import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import axios from 'axios';
import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import diagnosisRepository from '../repositories/diagnosis.repository.js';

const logger = createLogger('disease-service');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gemini diagnosis prompt (extracted from monolith cropDoctorController.js)
const DIAGNOSIS_PROMPT = `You are a world-class agricultural plant pathologist specializing in Indian crops. Analyze this crop/plant image thoroughly.

Return ONLY a valid JSON object with NO markdown, NO extra text:

{
  "isHealthy": false,
  "diseaseName": "Early Blight",
  "scientificName": "Alternaria solani",
  "confidence": 94,
  "severity": "moderate",
  "cause": "fungal",
  "causeClassification": "Pathogen / Fungal Infection",
  "affectedCrop": "Tomato",
  "description": "2-3 sentence simple farmer-friendly explanation",
  "symptoms": [{ "title": "...", "description": "...", "severity": "high" }],
  "treatment": {
    "immediateAction": "...",
    "steps": [{ "stepNumber": 1, "title": "...", "description": "...", "urgency": "urgent", "timeframe": "Today" }],
    "harvestSafetyInterval": "7 days after last spray",
    "totalDuration": "3-4 weeks"
  },
  "prevention": [{ "title": "...", "description": "...", "icon": "water" }],
  "recommendedProducts": {
    "sprays": [{ "name": "...", "brand": "...", "type": "fungicide", "dosage": "...", "estimatedPriceMin": 300, "estimatedPriceMax": 500, "effectiveness": "high", "isBestChoice": true }],
    "fertilizers": [{ "name": "...", "brand": "...", "purpose": "...", "dosage": "...", "estimatedPriceMin": 400, "estimatedPriceMax": 600 }],
    "organic": [{ "name": "...", "brand": "...", "purpose": "...", "dosage": "...", "estimatedPriceMin": 200, "estimatedPriceMax": 400 }]
  },
  "similarDiseases": [{ "name": "Late Blight", "similarity": 72, "keyDifference": "..." }]
}

If the crop appears healthy return isHealthy: true with empty treatment and relevant prevention tips.
Be specific to Indian farming conditions. Give Indian brand names and prices in INR.`;

class DiseaseService {
  /**
   * Diagnose a crop image.
   */
  async diagnose(userId, filePath, mimeType, body = {}) {
    // 1. Upload to Cloudinary
    const cloudResult = await cloudinary.uploader.upload(filePath, { folder: 'kmc/crop-doctor', resource_type: 'image' });
    const imageUrl = cloudResult.secure_url;

    // 2. Read image as base64
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');

    // 3. Plant.id detection (via AI service call)
    let plantIdResult = { success: false };
    try {
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://ai-service:3003';
      const { data } = await axios.post(`${aiServiceUrl}/detect/plant`, { image: base64Image }, {
        headers: { 'x-internal-service': 'disease-service' },
        timeout: 30000,
      });
      plantIdResult = data?.data || data || { success: false };
    } catch (err) {
      logger.warn('Plant.id detection skipped:', err.message);
    }

    if (plantIdResult.success && !plantIdResult.isPlant) {
      this._cleanup(filePath);
      throw HttpError.badRequest('This does not appear to be a plant. Please upload a clear picture of a crop.');
    }

    // 4. Gemini Vision analysis (via AI service)
    let geminiResult = null;
    try {
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://ai-service:3003';
      const dynamicPrompt = plantIdResult.success
        ? `The crop diagnosis is confirmed as: **${plantIdResult.diseaseName}** (Healthy: ${plantIdResult.isHealthy}). Generate JSON based on this diagnosis.\n\n${DIAGNOSIS_PROMPT}`
        : DIAGNOSIS_PROMPT;

      const { data } = await axios.post(`${aiServiceUrl}/analyze/image`, {
        prompt: dynamicPrompt,
        image: base64Image,
        mimeType: mimeType || 'image/jpeg',
        json: true,
      }, {
        headers: { 'x-internal-service': 'disease-service' },
        timeout: 60000,
      });

      geminiResult = data?.data?.result || data?.result;
    } catch (err) {
      logger.error('Gemini analysis failed:', err.message);
    }

    this._cleanup(filePath);

    if (!geminiResult) {
      throw HttpError.serviceUnavailable('AI analysis failed. Please try again.');
    }

    // 5. Normalize & save
    const diagnosis = await diagnosisRepository.create({
      farmerId: userId,
      imageUrl,
      cropName: geminiResult.affectedCrop || body.cropName || null,
      fieldName: body.fieldName || null,
      diseaseName: geminiResult.diseaseName || 'Unknown',
      scientificName: geminiResult.scientificName || null,
      severity: geminiResult.severity || 'Unknown',
      confidence: geminiResult.confidence || 0,
      description: geminiResult.description || '',
      cause: geminiResult.cause || null,
      causeClassification: geminiResult.causeClassification || null,
      symptoms: JSON.stringify(geminiResult.symptoms || []),
      treatment: JSON.stringify(geminiResult.treatment || null),
      prevention: JSON.stringify(geminiResult.prevention || []),
      isHealthy: geminiResult.isHealthy ?? false,
      similarDiseases: JSON.stringify(geminiResult.similarDiseases || []),
      recommendedProducts: JSON.stringify(geminiResult.recommendedProducts || { sprays: [], fertilizers: [], organic: [] }),
      rawResponse: JSON.stringify(geminiResult),
    });

    // 6. Publish event
    await publishEvent(EXCHANGES.DISEASES, 'disease.diagnosed', {
      diagnosisId: diagnosis.id,
      userId,
      diseaseName: geminiResult.diseaseName,
      isHealthy: geminiResult.isHealthy,
      severity: geminiResult.severity,
    }).catch(() => {});

    return { diagnosis, geminiResult };
  }

  async getHistory(farmerId, query = {}) {
    return diagnosisRepository.findByFarmer(farmerId, {
      limit: parseInt(query.limit || '20', 10),
      offset: parseInt(query.offset || '0', 10),
    });
  }

  async getDetail(farmerId, id) {
    const diagnosis = await diagnosisRepository.findById(id);
    if (!diagnosis || diagnosis.farmerId !== farmerId) {
      throw HttpError.notFound('Diagnosis not found');
    }
    const safeJsonParse = (str, fb) => { try { return JSON.parse(str); } catch { return fb; } };
    return {
      ...diagnosis,
      symptoms: safeJsonParse(diagnosis.symptoms, []),
      treatment: safeJsonParse(diagnosis.treatment, null),
      prevention: safeJsonParse(diagnosis.prevention, []),
      recommendedProducts: safeJsonParse(diagnosis.recommendedProducts, { sprays: [], fertilizers: [], organic: [] }),
      similarDiseases: safeJsonParse(diagnosis.similarDiseases, []),
    };
  }

  _cleanup(filePath) {
    try { fs.unlinkSync(filePath); } catch (_) {}
  }
}

export default new DiseaseService();
