import { User, FarmerSurvey } from '../models/index.js';

// Submit farmer onboarding survey
export const submitSurvey = async (req, res) => {
    try {
        const { userId, surveyData } = req.body;

        if (!surveyData) {
            return res.json({ success: false, message: "Survey data is required" });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Upsert into farmer_surveys table
        const existingSurvey = await FarmerSurvey.findOne({ where: { userId } });

        const surveyPayload = {
            userId: userId,
            language: surveyData.language,
            farmName: surveyData.farmName,
            farmSize: surveyData.farmSize,
            farmSizeUnit: surveyData.farmSizeUnit || 'acres',
            landOwnership: surveyData.landOwnership,
            soilType: surveyData.soilType,
            waterSource: surveyData.waterSource,
            primaryCrops: surveyData.primaryCrops || [],
            farmingExperience: surveyData.farmingExperience,
        };

        if (existingSurvey) {
            await existingSurvey.update(surveyPayload);
        } else {
            await FarmerSurvey.create(surveyPayload);
        }

        // Update user flags
        const userUpdate = { hasCompletedSurvey: true };

        // Also update language preference if provided
        if (surveyData.language) {
            userUpdate.language = surveyData.language;
            userUpdate.preferredLanguage = surveyData.language;
        }

        // Update crops on user level too
        if (surveyData.primaryCrops && surveyData.primaryCrops.length > 0) {
            userUpdate.crops = surveyData.primaryCrops;
        }

        await user.update(userUpdate);

        res.json({
            success: true,
            message: "Survey submitted successfully",
            surveyData: {
                language: surveyData.language,
                farmName: surveyData.farmName,
                farmSize: surveyData.farmSize,
                farmSizeUnit: surveyData.farmSizeUnit || 'acres',
                landOwnership: surveyData.landOwnership,
                soilType: surveyData.soilType,
                waterSource: surveyData.waterSource,
                primaryCrops: surveyData.primaryCrops || [],
                farmingExperience: surveyData.farmingExperience,
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get survey completion status
export const getSurveyStatus = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findByPk(userId, { attributes: ['hasCompletedSurvey'] });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let surveyData = null;
        if (user.hasCompletedSurvey) {
            const survey = await FarmerSurvey.findOne({ where: { userId } });

            if (survey) {
                surveyData = {
                    language: survey.language,
                    farmName: survey.farmName,
                    farmSize: survey.farmSize,
                    farmSizeUnit: survey.farmSizeUnit,
                    landOwnership: survey.landOwnership,
                    soilType: survey.soilType,
                    waterSource: survey.waterSource,
                    primaryCrops: survey.primaryCrops,
                    farmingExperience: survey.farmingExperience,
                };
            }
        }

        res.json({
            success: true,
            hasCompletedSurvey: user.hasCompletedSurvey,
            surveyData
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
