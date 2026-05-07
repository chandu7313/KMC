import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import soilRepository from '../repositories/soil.repository.js';
import { analyzeSoil } from './soil-analysis.service.js';

const logger = createLogger('soil-service');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class SoilService {
  async uploadReport(userId, body, file) {
    let reportFileUrl = null;
    if (file) {
      const upload = await cloudinary.uploader.upload(file.path, { resource_type: 'auto' });
      reportFileUrl = upload.secure_url;
    }

    const { ph, nitrogen, phosphorus, potassium, organicMatter } = body;
    const hasManualData = ph && nitrogen && phosphorus && potassium && organicMatter;

    let status = 'Pending';
    let recommendations = {};

    if (hasManualData) {
      status = 'Completed';
      recommendations = analyzeSoil(parseFloat(ph), parseFloat(nitrogen), parseFloat(phosphorus), parseFloat(potassium), parseFloat(organicMatter));
    }

    const report = await soilRepository.create({
      farmerId: userId,
      reportFile: reportFileUrl,
      status,
      ph: ph ? parseFloat(ph) : null,
      nitrogen: nitrogen ? parseFloat(nitrogen) : null,
      phosphorus: phosphorus ? parseFloat(phosphorus) : null,
      potassium: potassium ? parseFloat(potassium) : null,
      organicMatter: organicMatter ? parseFloat(organicMatter) : null,
      recommendedFertilizer: recommendations.fertilizers || null,
      suitableCrops: recommendations.crops || [],
      soilStatus: recommendations.phStatus || null,
      suitabilityPct: recommendations.suitabilityPct || null,
    });

    if (status === 'Completed') {
      const reminderDate = new Date();
      reminderDate.setMonth(reminderDate.getMonth() + 6);

      await soilRepository.update(report.id, { nextTestDate: reminderDate.toISOString() });
      await soilRepository.createReminder({ userId, reportId: report.id, reminderDate: reminderDate.toISOString() });
    }

    await publishEvent(EXCHANGES.SOIL, 'soil.report_created', { reportId: report.id, userId, status }).catch(() => {});

    return report;
  }

  async getHistory(farmerId) {
    return soilRepository.findByFarmer(farmerId);
  }

  async adminGetAllReports() {
    return soilRepository.findAll();
  }

  async adminAnalyzeReport(id, body) {
    const report = await soilRepository.findById(id);
    if (!report) throw HttpError.notFound('Report not found');

    const { ph, nitrogen, phosphorus, potassium, organicMatter } = body;
    const recommendations = analyzeSoil(parseFloat(ph), parseFloat(nitrogen), parseFloat(phosphorus), parseFloat(potassium), parseFloat(organicMatter));

    const reminderDate = new Date();
    reminderDate.setMonth(reminderDate.getMonth() + 6);

    const updated = await soilRepository.update(id, {
      ph: parseFloat(ph), nitrogen: parseFloat(nitrogen), phosphorus: parseFloat(phosphorus),
      potassium: parseFloat(potassium), organicMatter: parseFloat(organicMatter),
      status: 'Completed',
      recommendedFertilizer: recommendations.fertilizers,
      suitableCrops: recommendations.crops,
      soilStatus: recommendations.phStatus,
      suitabilityPct: recommendations.suitabilityPct,
      nextTestDate: reminderDate.toISOString(),
    });

    // Upsert reminder
    const existing = await soilRepository.findReminderByReport(id);
    if (existing) await soilRepository.updateReminder(existing.id, { reminderDate: reminderDate.toISOString() });
    else await soilRepository.createReminder({ userId: report.farmerId, reportId: id, reminderDate: reminderDate.toISOString() });

    return updated;
  }

  async adminCreateReport(body) {
    const { farmerId, ph, nitrogen, phosphorus, potassium, organicMatter } = body;
    if (!farmerId || !ph || !nitrogen || !phosphorus || !potassium || !organicMatter) {
      throw HttpError.badRequest('All fields are required');
    }

    const recommendations = analyzeSoil(parseFloat(ph), parseFloat(nitrogen), parseFloat(phosphorus), parseFloat(potassium), parseFloat(organicMatter));
    const reminderDate = new Date();
    reminderDate.setMonth(reminderDate.getMonth() + 6);

    const report = await soilRepository.create({
      farmerId, ph: parseFloat(ph), nitrogen: parseFloat(nitrogen), phosphorus: parseFloat(phosphorus),
      potassium: parseFloat(potassium), organicMatter: parseFloat(organicMatter),
      status: 'Completed',
      recommendedFertilizer: recommendations.fertilizers,
      suitableCrops: recommendations.crops, soilStatus: recommendations.phStatus,
      suitabilityPct: recommendations.suitabilityPct, nextTestDate: reminderDate.toISOString(),
    });

    await soilRepository.createReminder({ userId: farmerId, reportId: report.id, reminderDate: reminderDate.toISOString() });
    return report;
  }

  async analyzeStandalone(body) {
    const { ph, nitrogen, phosphorus, potassium, organicMatter } = body;
    if (ph === undefined || nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
      throw HttpError.badRequest('ph, nitrogen, phosphorus, and potassium are required');
    }
    return analyzeSoil(parseFloat(ph), parseFloat(nitrogen), parseFloat(phosphorus), parseFloat(potassium), parseFloat(organicMatter || 0));
  }

  async analyzeWithAI(body) {
    const { ph, nitrogen, phosphorus, potassium, organicMatter, language } = body;
    if (ph === undefined || nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
      throw HttpError.badRequest('ph, nitrogen, phosphorus, and potassium are required');
    }

    const lang = language === 'hi' ? 'simple Hinglish (Hindi-English mix)' : 'simple English';
    const prompt = `You are an expert Indian agricultural soil scientist. Soil data:
- pH: ${ph}, N: ${nitrogen} kg/ha, P: ${phosphorus} kg/ha, K: ${potassium} kg/ha, Organic Matter: ${organicMatter || 0}%
Return ONLY JSON: { "overallHealth": "Good/Average/Poor", "healthScore": 75, "summary": "...", "recommendations": ["..."], "fertilizers": [{"name":"...","dosage":"...","when":"..."}], "bestCrops": ["..."], "warnings": ["..."] }
Use ${lang}. Be specific to Indian farming. Mention Indian brand fertilizers with prices in INR.`;

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://ai-service:3003';
    const { data } = await axios.post(`${aiServiceUrl}/analyze/text`, { prompt, json: true }, {
      headers: { 'x-internal-service': 'soil-service' },
      timeout: 30000,
    });

    return data?.data?.result || data?.result;
  }

  async getFarmerHistory(farmerId) {
    return soilRepository.findByFarmer(farmerId);
  }
}

export default new SoilService();
