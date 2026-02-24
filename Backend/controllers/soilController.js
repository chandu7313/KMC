import SoilReport from '../models/SoilReport.js';
import SoilReminder from '../models/SoilReminder.js';
import { analyzeSoil } from '../services/soilAnalysisService.js';
import { generateHealthCardPDF } from '../services/pdfService.js';
import { v2 as cloudinary } from 'cloudinary';

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

        const report = new SoilReport({
            farmerId: req.userId || req.body.userId,
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
        });

        await report.save();

        if (status === 'Completed') {
            const reminderDate = new Date(report.createdAt || Date.now());
            reminderDate.setMonth(reminderDate.getMonth() + 6);
            report.nextTestDate = reminderDate;
            await report.save();
            await SoilReminder.create({ user: req.userId || req.body.userId, report: report._id, reminderDate });
        }

        res.status(201).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getHistory = async (req, res) => {
    try {
        const tests = await SoilReport.find({ farmerId: req.userId || req.body.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: tests.length, data: tests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const downloadHealthCard = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await SoilReport.findById(id).populate('user', 'name email');
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        if (report.status !== 'Completed') return res.status(400).json({ success: false, message: 'Report is pending analysis.' });

        const pdfBuffer = await generateHealthCardPDF(report);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Soil_Health_Card_${id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const adminGetAllReports = async (req, res) => {
    try {
        const tests = await SoilReport.find().populate('farmerId', 'name email phone').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: tests.length, data: tests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const adminAnalyzeReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { ph, nitrogen, phosphorus, potassium, organicMatter } = req.body;

        const report = await SoilReport.findById(id);
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

        report.ph = parseFloat(ph);
        report.nitrogen = parseFloat(nitrogen);
        report.phosphorus = parseFloat(phosphorus);
        report.potassium = parseFloat(potassium);
        report.organicMatter = parseFloat(organicMatter);
        report.status = 'Completed';

        const recommendations = analyzeSoil(report.ph, report.nitrogen, report.phosphorus, report.potassium, report.organicMatter);
        report.recommendedFertilizer = recommendations.fertilizers;
        report.suitableCrops = recommendations.crops;
        report.soilStatus = recommendations.phStatus;
        report.suitabilityPct = recommendations.suitabilityPct;

        const reminderDate = new Date();
        reminderDate.setMonth(reminderDate.getMonth() + 6);
        report.nextTestDate = reminderDate;

        await report.save();

        await SoilReminder.findOneAndUpdate(
            { report: report._id },
            { user: report.farmerId, report: report._id, reminderDate },
            { upsert: true, new: true }
        );

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

        const report = new SoilReport({
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
            suitabilityPct: recommendations.suitabilityPct
        });

        await report.save();

        const reminderDate = new Date();
        reminderDate.setMonth(reminderDate.getMonth() + 6);
        report.nextTestDate = reminderDate;
        await report.save();

        await SoilReminder.create({
            user: farmerId,
            report: report._id,
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
        const history = await SoilReport.find({ farmerId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
