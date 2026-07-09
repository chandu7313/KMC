import { models } from '@kissan/shared';
import userRepository from '../repositories/user.repository.js';

const { FarmerSurvey, User } = models;

class SurveyService {
  /**
   * Get the survey data for a specific user
   */
  async getSurveyStatus(userId) {
    const survey = await FarmerSurvey.findOne({
      where: { userId },
      raw: true
    });
    
    return {
      hasCompletedSurvey: !!survey,
      surveyData: survey || null
    };
  }

  /**
   * Submit or update survey data for a user
   */
  async submitSurvey(userId, surveyData) {
    // 1. Upsert FarmerSurvey record
    const [survey, created] = await FarmerSurvey.upsert({
      userId,
      language: surveyData.language,
      farm_name: surveyData.farmName,
      farm_size: surveyData.farmSize,
      farm_size_unit: surveyData.farmSizeUnit || 'acres',
      farming_experience: surveyData.farmingExperience,
      land_ownership: surveyData.landOwnership,
      soil_type: surveyData.soilType,
      water_source: surveyData.waterSource,
      primary_crops: surveyData.primaryCrops || []
    }, { returning: true });

    // 2. Update User record
    await userRepository.update(userId, {
      has_completed_survey: true,
      language: surveyData.language || 'en',
      preferred_language: surveyData.language || 'en',
      crops: surveyData.primaryCrops || []
    });

    return survey;
  }
}

export default new SurveyService();
