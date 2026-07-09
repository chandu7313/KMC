import { successResponse } from '@kissan/shared';
import surveyService from '../services/survey.service.js';

export const getSurveyStatus = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const data = await surveyService.getSurveyStatus(userId);
    return successResponse(res, data, 'Survey status retrieved');
  } catch (error) {
    next(error);
  }
};

export const submitSurvey = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { surveyData } = req.body;
    const data = await surveyService.submitSurvey(userId, surveyData);
    return successResponse(res, { survey: data }, 'Survey submitted successfully');
  } catch (error) {
    next(error);
  }
};
