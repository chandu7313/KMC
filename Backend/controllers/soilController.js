import { SoilReport, SoilReminder, User } from '../models/index.js';
import { analyzeSoil } from '../services/soilAnalysisService.js';
import { generateHealthCardPDF } from '../services/pdfService.js';
import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const uploadReport = async (req, res) => {
    try {
        let reportFileUrl = null;
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
            reportFileUrl = imageUpload.secure_url;
        }

        const { ph, nitrogen, phosphorus, potassium, organicMatter } = req.body;
        const hasManualData = ph && nitrogen && phosphorus && potassium && organicMatter;

        let status = 'Pending';
        let recommendations = {};

        if (hasManualData) {
            status = 'Completed';
            recommendations = analyzeSoil(
                parseFloat(ph),
                parseFloat(nitrogen),
                parseFloat(phosphorus),
                parseFloat(potassium),
                parseFloat(organicMatter)
            );
        }

        const farmerId = req.userId || req.body.userId;

        const reportData = {
            farmerId,
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
            suitabilityPct: recommendations.suitabilityPct || null
        };

        const report = await SoilReport.create(reportData);

        if (status === 'Completed') {
            const reminderDate = new Date(report.createdAt || Date.now());
            reminderDate.setMonth(reminderDate.getMonth() + 6);

            await report.update({ nextTestDate: reminderDate });

            await SoilReminder.create({
                userId: farmerId,
                reportId: report.id,
                reminderDate
            });
        }

        res.status(201).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getHistory = async (req, res) => {
    try {
        const farmerId = req.userId || req.body.userId;
        const tests = await SoilReport.findAll({
            where: { farmerId },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, count: tests.length, data: tests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const downloadHealthCard = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await SoilReport.findByPk(id, {
            include: [{ model: User, attributes: ['name', 'email'] }]
        });

        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        if (report.status !== 'Completed') return res.status(400).json({ success: false, message: 'Report is pending analysis.' });

        // Map for PDF generation compat
        const reportData = report.toJSON();
        reportData.users = reportData.User;

        const pdfBuffer = await generateHealthCardPDF(reportData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Soil_Health_Card_${id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const adminGetAllReports = async (req, res) => {
    try {
        const tests = await SoilReport.findAll({
            include: [{ model: User, attributes: ['name', 'email', 'phone'] }],
            order: [['createdAt', 'DESC']]
        });

        const mapped = tests.map(t => {
            const data = t.toJSON();
            const user = data.User;
            data.farmerId = user ? { _id: data.farmerId, name: user.name, email: user.email, phone: user.phone } : { _id: data.farmerId };
            delete data.User;
            return data;
        });

        res.status(200).json({ success: true, count: mapped.length, data: mapped });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const adminAnalyzeReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { ph, nitrogen, phosphorus, potassium, organicMatter } = req.body;

        const report = await SoilReport.findByPk(id);

        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

        const recommendations = analyzeSoil(
            parseFloat(ph),
            parseFloat(nitrogen),
            parseFloat(phosphorus),
            parseFloat(potassium),
            parseFloat(organicMatter)
        );

        const reminderDate = new Date();
        reminderDate.setMonth(reminderDate.getMonth() + 6);

        await report.update({
            ph: parseFloat(ph),
            nitrogen: parseFloat(nitrogen),
            phosphorus: parseFloat(phosphorus),
            potassium: parseFloat(potassium),
            organicMatter: parseFloat(organicMatter),
            status: 'Completed',
            recommendedFertilizer: recommendations.fertilizers,
            suitableCrops: recommendations.crops,
            soilStatus: recommendations.phStatus,
            suitabilityPct: recommendations.suitabilityPct,
            nextTestDate: reminderDate
        });

        // Upsert soil reminder
        const existingReminder = await SoilReminder.findOne({ where: { reportId: id } });

        if (existingReminder) {
            await existingReminder.update({ reminderDate });
        } else {
            await SoilReminder.create({
                userId: report.farmerId,
                reportId: id,
                reminderDate
            });
        }

        res.status(200).json({ success: true, data: report, message: 'Analyzed successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const adminCreateReport = async (req, res) => {
    try {
        const { farmerId, ph, nitrogen, phosphorus, potassium, organicMatter } = req.body;

        if (!farmerId || !ph || !nitrogen || !phosphorus || !potassium || !organicMatter) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const recommendations = analyzeSoil(
            parseFloat(ph),
            parseFloat(nitrogen),
            parseFloat(phosphorus),
            parseFloat(potassium),
            parseFloat(organicMatter)
        );

        const reminderDate = new Date();
        reminderDate.setMonth(reminderDate.getMonth() + 6);

        const report = await SoilReport.create({
            farmerId,
            ph: parseFloat(ph),
            nitrogen: parseFloat(nitrogen),
            phosphorus: parseFloat(phosphorus),
            potassium: parseFloat(potassium),
            organicMatter: parseFloat(organicMatter),
            status: 'Completed',
            recommendedFertilizer: recommendations.fertilizers,
            suitableCrops: recommendations.crops,
            soilStatus: recommendations.phStatus,
            suitabilityPct: recommendations.suitabilityPct,
            nextTestDate: reminderDate
        });

        await SoilReminder.create({
            userId: farmerId,
            reportId: report.id,
            reminderDate
        });

        res.status(201).json({ success: true, data: report, message: 'Soil report created and analyzed successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const analyzeStandalone = async (req, res) => {
    try {
        const { ph, nitrogen, phosphorus, potassium, organicMatter } = req.body;

        if (ph === undefined || nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
            return res.status(400).json({ success: false, message: 'ph, nitrogen, phosphorus, and potassium are required.' });
        }

        const result = analyzeSoil(
            parseFloat(ph),
            parseFloat(nitrogen),
            parseFloat(phosphorus),
            parseFloat(potassium),
            parseFloat(organicMatter || 0)
        );

        res.status(200).json({
            success: true,
            data: {
                soilStatus: result.phStatus,
                nutrientClassification: result.nutrientClassification,
                suggestedAction: result.fertilizers,
                crops: result.crops
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFarmerHistory = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const history = await SoilReport.findAll({
            where: { farmerId },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const analyzeWithAI = async (req, res) => {
    try {
        const { ph, nitrogen, phosphorus, potassium, organicMatter, language } = req.body;

        if (ph === undefined || nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
            return res.status(400).json({ success: false, message: 'ph, nitrogen, phosphorus, and potassium are required.' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: 'AI service not configured.' });
        }

        const lang = language === 'hi' ? 'simple Hinglish (Hindi-English mix)' : 'simple English';

        const prompt = `You are an expert Indian agricultural soil scientist. A farmer has provided their soil test data:
- Soil pH: ${ph}
- Nitrogen (N): ${nitrogen} kg/ha
- Phosphorus (P): ${phosphorus} kg/ha
- Potassium (K): ${potassium} kg/ha
- Organic Matter: ${organicMatter || 0}%

Analyze this soil data and provide a farmer-friendly soil health report.

Return ONLY a valid JSON object with NO markdown, NO extra text:
{
  "overallHealth": "Good" or "Average" or "Poor",
  "healthScore": 75,
  "summary": "One line summary of overall soil health in ${lang}",
  "recommendations": [
    "Short actionable recommendation 1 in ${lang}",
    "Short actionable recommendation 2 in ${lang}",
    "Short actionable recommendation 3 in ${lang}",
    "Short actionable recommendation 4 in ${lang}",
    "Short actionable recommendation 5 in ${lang}"
  ],
  "fertilizers": [
    { "name": "Fertilizer name", "dosage": "how much per acre", "when": "when to apply" }
  ],
  "bestCrops": ["Crop1", "Crop2", "Crop3"],
  "warnings": ["Any urgent warning in ${lang}"]
}

Keep all text in ${lang}. Be specific to Indian farming. Use simple words a farmer can understand. Mention specific Indian brand fertilizers with prices in INR where possible.`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const MODELS = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];

        let aiResult = null;
        let lastError = null;

        for (const modelName of MODELS) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { responseMimeType: 'application/json' },
                });
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                aiResult = JSON.parse(text);
                break;
            } catch (err) {
                lastError = err;
                const is429 = err?.message?.includes('429') || err?.message?.includes('quota');
                const is404 = err?.message?.includes('404') || err?.message?.includes('not found');
                if (is429 || is404) {
                    await new Promise(r => setTimeout(r, 2000));
                    continue;
                }
                break;
            }
        }

        if (!aiResult) {
            return res.status(500).json({ success: false, message: 'AI analysis failed. Please try again in a few minutes.' });
        }

        res.status(200).json({ success: true, data: aiResult });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
