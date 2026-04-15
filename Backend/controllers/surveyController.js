import userModel from '../models/userModel.js'

// Submit farmer onboarding survey
export const submitSurvey = async (req, res) => {
    try {
        const { userId, surveyData } = req.body;

        if (!surveyData) {
            return res.json({ success: false, message: "Survey data is required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Update user with survey data
        user.surveyData = {
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
        user.hasCompletedSurvey = true;

        // Also update language preference if provided
        if (surveyData.language) {
            user.language = surveyData.language;
            user.preferredLanguage = surveyData.language;
        }

        // Update crops on user level too
        if (surveyData.primaryCrops && surveyData.primaryCrops.length > 0) {
            user.crops = surveyData.primaryCrops;
        }

        await user.save();

        res.json({
            success: true,
            message: "Survey submitted successfully",
            surveyData: user.surveyData
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get survey completion status
export const getSurveyStatus = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            hasCompletedSurvey: user.hasCompletedSurvey,
            surveyData: user.surveyData || null
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
