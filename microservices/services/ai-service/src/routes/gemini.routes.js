import express from 'express';
import { authenticate } from '@kissan/shared';
import * as aiCtrl from '../controllers/ai.controller.js';

const router = express.Router();

// Internal service-to-service endpoints (authenticated)
router.post('/analyze/text', authenticate, aiCtrl.analyzeText);
router.post('/analyze/image', authenticate, aiCtrl.analyzeImage);
router.post('/detect/plant', authenticate, aiCtrl.detectPlantDisease);

export default router;
