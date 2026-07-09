import express from 'express';
import { authenticate } from '@kissan/shared';
import * as surveyCtrl from '../controllers/survey.controller.js';

const router = express.Router();

// All survey routes require authentication
router.use(authenticate);

// GET  /survey/status       — Get user survey status
router.get('/status', surveyCtrl.getSurveyStatus);

// POST /survey/submit       — Submit or update user survey
router.post('/submit', surveyCtrl.submitSurvey);

export default router;
