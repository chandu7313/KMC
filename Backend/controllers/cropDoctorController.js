import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CropDiagnosis } from '../models/index.js';
import { detectDiseaseWithPlantId } from '../services/plantIdService.js';
// ============================================================
// Gemini Vision prompt for comprehensive crop diagnosis
// ============================================================
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

  "symptoms": [
    {
      "title": "Brown Circular Spots",
      "description": "Dark brown spots with concentric rings on older leaves",
      "severity": "high"
    },
    {
      "title": "Yellow Halo",
      "description": "Yellow area surrounding the brown spots",
      "severity": "medium"
    }
  ],

  "treatment": {
    "immediateAction": "Remove and destroy all visibly infected leaves today. Do not compost them.",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Remove Infected Parts",
        "description": "Cut and bag all infected leaves immediately",
        "urgency": "urgent",
        "timeframe": "Today"
      },
      {
        "stepNumber": 2,
        "title": "Apply Fungicide",
        "description": "Spray Mancozeb 75% WP at 2.5g per litre",
        "urgency": "high",
        "timeframe": "Within 24 hours"
      },
      {
        "stepNumber": 3,
        "title": "Repeat Application",
        "description": "Apply every 7 days for 3-4 rounds",
        "urgency": "normal",
        "timeframe": "Weekly"
      },
      {
        "stepNumber": 4,
        "title": "Re-inspect Crop",
        "description": "Check for recovery after 14 days",
        "urgency": "normal",
        "timeframe": "14 days later"
      }
    ],
    "harvestSafetyInterval": "7 days after last spray",
    "totalDuration": "3-4 weeks"
  },

  "prevention": [
    {
      "title": "Avoid Overhead Irrigation",
      "description": "Use drip irrigation to keep leaves dry",
      "icon": "water"
    },
    {
      "title": "Crop Rotation",
      "description": "Rotate with non-solanaceous crops every season",
      "icon": "rotate"
    },
    {
      "title": "Remove Infected Debris",
      "description": "Clear crop debris after harvest to prevent spores",
      "icon": "trash"
    },
    {
      "title": "Proper Spacing",
      "description": "Maintain plant spacing for air circulation",
      "icon": "spacing"
    }
  ],

  "recommendedProducts": {
    "sprays": [
      {
        "name": "Mancozeb 75% WP",
        "brand": "Dhanuka Agritech",
        "type": "fungicide",
        "activeIngredient": "Mancozeb 75%",
        "dosage": "2.5g per litre of water",
        "applicationMethod": "Knapsack sprayer, cover both leaf surfaces",
        "frequency": "Every 7 days",
        "numberOfApplications": "3-4 sprays",
        "timing": "Early morning or evening",
        "safetyInterval": "7 days before harvest",
        "precautions": "Wear gloves and mask. Do not spray before rain.",
        "estimatedPriceMin": 300,
        "estimatedPriceMax": 500,
        "effectiveness": "high",
        "isBestChoice": true
      },
      {
        "name": "Copper Oxychloride 50% WP",
        "brand": "UPL",
        "type": "fungicide",
        "activeIngredient": "Copper Oxychloride 50%",
        "dosage": "3g per litre of water",
        "applicationMethod": "Foliar spray",
        "frequency": "Every 10 days",
        "numberOfApplications": "3 sprays",
        "timing": "Early morning",
        "safetyInterval": "10 days before harvest",
        "precautions": "Avoid spraying in hot sun",
        "estimatedPriceMin": 250,
        "estimatedPriceMax": 400,
        "effectiveness": "high",
        "isBestChoice": false
      }
    ],
    "fertilizers": [
      {
        "name": "NPK 19-19-19",
        "brand": "Coromandel",
        "type": "fertilizer",
        "purpose": "Restore plant strength after disease stress",
        "dosage": "3g per litre of water",
        "applicationMethod": "Foliar spray or soil application",
        "when": "After disease is under control",
        "estimatedPriceMin": 400,
        "estimatedPriceMax": 600,
        "effectiveness": "medium",
        "isBestChoice": true
      },
      {
        "name": "Potassium Humate",
        "brand": "Multiplex",
        "type": "micronutrient",
        "purpose": "Boost immunity and root health",
        "dosage": "2ml per litre",
        "applicationMethod": "Soil drench",
        "when": "Weekly during recovery",
        "estimatedPriceMin": 200,
        "estimatedPriceMax": 350,
        "effectiveness": "medium",
        "isBestChoice": false
      }
    ],
    "organic": [
      {
        "name": "Neem Oil Spray",
        "brand": "Multiplex Bio",
        "type": "organic",
        "purpose": "Natural antifungal and immunity booster",
        "dosage": "5ml per litre + few drops of liquid soap",
        "applicationMethod": "Foliar spray, coat all leaf surfaces",
        "frequency": "Every 5 days",
        "timing": "Evening preferred",
        "estimatedPriceMin": 200,
        "estimatedPriceMax": 400,
        "effectiveness": "medium",
        "isBestChoice": true
      },
      {
        "name": "Trichoderma Viride",
        "brand": "T-Stanes",
        "type": "biocontrol",
        "purpose": "Biological control of soil-borne pathogens",
        "dosage": "5g per litre",
        "applicationMethod": "Soil drench near root zone",
        "frequency": "Once every 15 days",
        "estimatedPriceMin": 150,
        "estimatedPriceMax": 300,
        "effectiveness": "medium",
        "isBestChoice": false
      }
    ]
  },

  "similarDiseases": [
    {
      "name": "Late Blight",
      "similarity": 72,
      "keyDifference": "Late Blight has water-soaked lesions unlike dry brown spots"
    },
    {
      "name": "Septoria Leaf Spot",
      "similarity": 65,
      "keyDifference": "Septoria spots are smaller with dark borders"
    }
  ]
}

If the crop appears healthy return:
{
  "isHealthy": true,
  "diseaseName": "Healthy Crop",
  "confidence": 96,
  "description": "Your crop appears healthy. Continue good farming practices.",
  "symptoms": [],
  "treatment": null,
  "prevention": [
    { "title": "Regular Monitoring", "description": "Inspect crops weekly for early signs of stress", "icon": "eye" },
    { "title": "Balanced Nutrition", "description": "Apply recommended NPK based on soil test results", "icon": "leaf" },
    { "title": "Water Management", "description": "Use drip irrigation and avoid waterlogging", "icon": "water" },
    { "title": "Crop Rotation", "description": "Rotate crops every season to maintain soil health", "icon": "rotate" }
  ],
  "recommendedProducts": { "sprays": [], "fertilizers": [], "organic": [] },
  "similarDiseases": []
}

Be specific to Indian farming conditions.
Give Indian brand names and prices in INR.`;

// ============================================================
// POST /api/crop-doctor/diagnose
// Upload crop image → Gemini Vision API → save diagnosis
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

        // 2. Read image file as base64
        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = req.file.mimetype || 'image/jpeg';

        // 3. Initial Disease Detection via Plant.id
        const plantIdResult = await detectDiseaseWithPlantId(base64Image);
        
        if (!plantIdResult.success) {
            console.error('Plant.id failed:', plantIdResult.message);
            // Fallback to purely Gemini if Plant.id fails? Or just return error?
            // The user wants to use Plant.id for disease detection.
        } else if (!plantIdResult.isPlant) {
             // Clean up temp file
             try { fs.unlinkSync(req.file.path); } catch (_) {}
             return res.json({ success: false, message: 'This does not appear to be a plant. Please upload a clear picture of a crop.' });
        }

        const detectedDisease = plantIdResult.success ? plantIdResult.diseaseName : 'Unknown';
        const isHealthyDetected = plantIdResult.success ? plantIdResult.isHealthy : false;

        // 4. Send to Gemini Vision API for structured analysis
        let geminiResult = null;
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY not set in environment');
            return res.json({ success: false, message: 'AI service not configured. Please contact support.' });
        }

        const MODELS_TO_TRY = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
        
        try {
            const dynamicPrompt = plantIdResult.success 
                ? `The crop has been analyzed by a specialized system. The diagnosis is confirmed as: **${detectedDisease}** (Healthy status: ${isHealthyDetected}). Do not diagnose it yourself. Generate the structured JSON response based strictly on this specific diagnosis.\n\n${DIAGNOSIS_PROMPT}`
                : DIAGNOSIS_PROMPT;

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const contentParts = [
                { text: dynamicPrompt },
                { inlineData: { mimeType, data: base64Image } },
            ];

            let lastError = null;
            for (const modelName of MODELS_TO_TRY) {
                try {
                    console.log(`Trying Gemini model: ${modelName}`);
                    const model = genAI.getGenerativeModel({
                        model: modelName,
                        generationConfig: { responseMimeType: 'application/json' },
                    });
                    const result = await model.generateContent(contentParts);
                    const responseText = result.response.text();
                    geminiResult = JSON.parse(responseText);
                    console.log(`✅ Success with model: ${modelName}`);
                    break; // Success — stop trying
                } catch (modelErr) {
                    lastError = modelErr;
                    const is429 = modelErr?.message?.includes('429') || modelErr?.message?.includes('quota');
                    const is404 = modelErr?.message?.includes('404') || modelErr?.message?.includes('not found');
                    console.warn(`⚠️ ${modelName} failed${is429 ? ' (rate limited)' : is404 ? ' (not found)' : ''}: ${modelErr?.message?.slice(0, 120)}`);
                    if (is429 || is404) {
                        // Rate limited or model gone — wait briefly, then try next model
                        await new Promise(r => setTimeout(r, 2000));
                        continue;
                    }
                    break; // Other errors — don't try more models
                }
            }

            if (!geminiResult) {
                const isQuotaError = lastError?.message?.includes('429') || lastError?.message?.includes('quota');
                console.error('All Gemini models exhausted:', lastError?.message);
                return res.json({ 
                    success: false, 
                    message: isQuotaError 
                        ? 'AI service quota exceeded. Please try again in a few minutes.' 
                        : 'AI analysis failed. Please try again.' 
                });
            }
        } catch (apiErr) {
            console.error('Gemini Vision API error:', apiErr?.message || apiErr);
            return res.json({ success: false, message: 'AI analysis failed. Please try again.' });
        } finally {
            // Clean up temp file
            try { fs.unlinkSync(req.file.path); } catch (_) {}
        }

        // 4. Extract and normalize fields from Gemini response
        const isHealthy = geminiResult.isHealthy ?? false;
        const diseaseName = geminiResult.diseaseName || (isHealthy ? 'Healthy Crop' : 'Unknown');
        const scientificName = geminiResult.scientificName || null;
        const confidence = geminiResult.confidence || 0;
        const description = geminiResult.description || '';
        const cause = geminiResult.cause || null;
        const causeClassification = geminiResult.causeClassification || null;
        const affectedCrop = geminiResult.affectedCrop || req.body.cropName || null;

        // Normalize severity
        let severity = geminiResult.severity || 'Unknown';
        severity = severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();

        const symptoms = geminiResult.symptoms || [];
        const treatment = geminiResult.treatment || null;
        const prevention = geminiResult.prevention || [];
        const recommendedProducts = geminiResult.recommendedProducts || { sprays: [], fertilizers: [], organic: [] };
        const similarDiseases = geminiResult.similarDiseases || [];

        // 5. Save to database
        const diagnosis = await CropDiagnosis.create({
            farmerId: userId,
            imageUrl,
            cropName: affectedCrop,
            fieldName: req.body.fieldName || null,
            diseaseName,
            scientificName,
            severity,
            confidence,
            description,
            cause,
            causeClassification,
            symptoms: JSON.stringify(symptoms),
            treatment: JSON.stringify(treatment),
            prevention: JSON.stringify(prevention),
            isHealthy,
            similarDiseases: JSON.stringify(similarDiseases),
            recommendedProducts: JSON.stringify(recommendedProducts),
            rawResponse: JSON.stringify(geminiResult),
            allSuggestions: null,
        });

        // 6. Return structured response
        return res.json({
            success: true,
            message: isHealthy ? 'Your crop looks healthy!' : `Disease detected: ${diseaseName}`,
            data: {
                id: diagnosis.id,
                imageUrl,
                diseaseName,
                scientificName,
                confidence,
                severity,
                description,
                cause,
                causeClassification,
                cropName: affectedCrop,
                isHealthy,
                symptoms,
                treatment,
                prevention,
                recommendedProducts,
                similarDiseases,
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
// Fetch single diagnosis detail with full structured data
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

        const safeJsonParse = (str, fallback) => {
            if (!str) return fallback;
            try { return JSON.parse(str); } catch (_) { return fallback; }
        };

        return res.json({
            success: true,
            data: {
                id: diagnosis.id,
                imageUrl: diagnosis.imageUrl,
                cropName: diagnosis.cropName,
                fieldName: diagnosis.fieldName,
                diseaseName: diagnosis.diseaseName,
                scientificName: diagnosis.scientificName,
                severity: diagnosis.severity,
                confidence: diagnosis.confidence,
                description: diagnosis.description,
                cause: diagnosis.cause,
                causeClassification: diagnosis.causeClassification,
                isHealthy: diagnosis.isHealthy,
                symptoms: safeJsonParse(diagnosis.symptoms, []),
                treatment: safeJsonParse(diagnosis.treatment, null),
                prevention: safeJsonParse(diagnosis.prevention, []),
                recommendedProducts: safeJsonParse(diagnosis.recommendedProducts, { sprays: [], fertilizers: [], organic: [] }),
                similarDiseases: safeJsonParse(diagnosis.similarDiseases, []),
                createdAt: diagnosis.createdAt,
            },
        });
    } catch (error) {
        console.error('Crop Doctor detail error:', error);
        return res.json({ success: false, message: error.message });
    }
};
