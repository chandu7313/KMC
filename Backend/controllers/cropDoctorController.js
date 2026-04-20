import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CropDiagnosis } from '../models/index.js';

// ============================================================
// POST /api/crop-doctor/diagnose
// Upload crop image → Plant.id API → save diagnosis
// ============================================================
export const diagnoseCrop = async (req, res) => {
    try {
        const userId = req.userId;

        if (!req.file) {
            return res.json({ success: false, message: 'Please upload a crop image' });
        }

        // 1. Upload image to Cloudinary
        const cloudResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'kmc/crop-doctor',
            resource_type: 'image',
        });
        const imageUrl = cloudResult.secure_url;

        // 2. Send to Plant.id Health Assessment API
        let diagnosisResult = null;
        try {
            const plantIdResponse = await axios.post(
                `${process.env.PLANT_ID_API_URL}/health_assessment`,
                {
                    images: [imageUrl],
                    latitude: req.body.latitude ? parseFloat(req.body.latitude) : undefined,
                    longitude: req.body.longitude ? parseFloat(req.body.longitude) : undefined,
                    similar_images: true,
                },
                {
                    headers: {
                        'Api-Key': process.env.PLANT_API_KEY,
                        'Content-Type': 'application/json',
                    },
                }
            );
            diagnosisResult = plantIdResponse.data;
        } catch (apiErr) {
            console.error('Plant.id API error:', apiErr?.response?.data || apiErr.message);
            // Still save the record even if API fails
        }

        // 3. Parse results
        let diseaseName = 'Unknown';
        let severity = 'Unknown';
        let confidence = 0;
        let description = '';
        let treatment = [];
        let prevention = [];
        let isHealthy = false;
        let suggestions = [];

        if (diagnosisResult?.result) {
            const healthResult = diagnosisResult.result;
            isHealthy = healthResult.is_healthy?.binary ?? false;

            if (healthResult.disease?.suggestions?.length > 0) {
                suggestions = healthResult.disease.suggestions;
                const top = suggestions[0];
                diseaseName = top.name || 'Unknown';
                confidence = top.probability ? Math.round(top.probability * 100) : 0;
                description = top.details?.description || '';
                treatment = top.details?.treatment?.biological || [];
                prevention = top.details?.treatment?.prevention || [];

                // Determine severity from probability
                if (top.probability > 0.8) severity = 'Severe';
                else if (top.probability > 0.5) severity = 'Moderate';
                else if (top.probability > 0.2) severity = 'Mild';
                else severity = 'Low';
            }

            if (isHealthy) {
                diseaseName = 'Healthy';
                severity = 'None';
                confidence = Math.round((healthResult.is_healthy?.probability || 1) * 100);
                description = 'Your crop appears to be healthy. No diseases detected.';
            }
        }

        // Gemini API integration for product recommendations
        let recommendedProductsStr = null;
        if (!isHealthy && process.env.GEMINI_API_KEY && diseaseName !== 'Unknown') {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ 
                    model: "gemini-1.5-flash",
                    generationConfig: { responseMimeType: "application/json" }
                });
                const prompt = `You are an agronomy expert. A farmer's crop (${req.body.cropName || 'a plant'}) was diagnosed with the disease: ${diseaseName}. Recommend exactly 2 commercial agriculture products (fungicides, fertilizers, or organic sprays) commonly available in the Indian agricultural market to treat or manage this. Return a JSON array where each object has these exact keys: "name" (string), "pack" (string, e.g. "500g Pack" or "1L Bottle"), "price" (string format like "₹450"), and "isBest" (boolean, true for the first item). Do not include images or descriptions. Only valid JSON elements.`;
                const result = await model.generateContent(prompt);
                recommendedProductsStr = result.response.text();
            } catch (geminiError) {
                console.error('Gemini API error during product suggestion:', geminiError);
            }
        }

        // 4. Save to database
        const diagnosis = await CropDiagnosis.create({
            farmerId: userId,
            imageUrl,
            cropName: req.body.cropName || null,
            fieldName: req.body.fieldName || null,
            diseaseName,
            severity,
            confidence,
            description,
            treatment: JSON.stringify(treatment),
            prevention: JSON.stringify(prevention),
            isHealthy,
            recommendedProducts: recommendedProductsStr,
            rawResponse: diagnosisResult ? JSON.stringify(diagnosisResult) : null,
            allSuggestions: suggestions.length > 0 ? JSON.stringify(
                suggestions.slice(0, 5).map(s => ({
                    name: s.name,
                    probability: s.probability,
                    description: s.details?.description || '',
                }))
            ) : null,
        });

        return res.json({
            success: true,
            message: isHealthy ? 'Your crop looks healthy!' : `Disease detected: ${diseaseName}`,
            data: {
                id: diagnosis.id,
                imageUrl,
                diseaseName,
                severity,
                confidence,
                description,
                treatment,
                prevention,
                isHealthy,
                recommendedProducts: recommendedProductsStr ? JSON.parse(recommendedProductsStr) : [],
                suggestions: suggestions.slice(0, 5).map(s => ({
                    name: s.name,
                    probability: Math.round((s.probability || 0) * 100),
                })),
                createdAt: diagnosis.createdAt,
            },
        });
    } catch (error) {
        console.error('Crop Doctor diagnose error:', error);
        return res.json({ success: false, message: error.message });
    }
};

// ============================================================
// GET /api/crop-doctor/history
// Fetch user's diagnosis history
// ============================================================
export const getHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const diagnoses = await CropDiagnosis.findAll({
            where: { farmerId: userId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            attributes: [
                'id', 'imageUrl', 'cropName', 'fieldName',
                'diseaseName', 'severity', 'confidence',
                'isHealthy', 'createdAt',
            ],
        });

        return res.json({
            success: true,
            data: diagnoses,
        });
    } catch (error) {
        console.error('Crop Doctor history error:', error);
        return res.json({ success: false, message: error.message });
    }
};

// ============================================================
// GET /api/crop-doctor/detail/:id
// Fetch single diagnosis detail
// ============================================================
export const getDetail = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const diagnosis = await CropDiagnosis.findOne({
            where: { id, farmerId: userId },
        });

        if (!diagnosis) {
            return res.json({ success: false, message: 'Diagnosis not found' });
        }

        return res.json({
            success: true,
            data: {
                ...diagnosis.toJSON(),
                treatment: diagnosis.treatment ? JSON.parse(diagnosis.treatment) : [],
                prevention: diagnosis.prevention ? JSON.parse(diagnosis.prevention) : [],
                allSuggestions: diagnosis.allSuggestions ? JSON.parse(diagnosis.allSuggestions) : [],
                recommendedProducts: diagnosis.recommendedProducts ? JSON.parse(diagnosis.recommendedProducts) : [],
                rawResponse: undefined, // Don't send raw response to client
            },
        });
    } catch (error) {
        console.error('Crop Doctor detail error:', error);
        return res.json({ success: false, message: error.message });
    }
};
