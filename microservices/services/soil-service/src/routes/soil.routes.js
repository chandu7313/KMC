import express from 'express';
import multer from 'multer';
import { authenticate, authorize } from '@kissan/shared';
import * as soilCtrl from '../controllers/soil.controller.js';

const router = express.Router();
const upload = multer({ dest: '/tmp/soil-uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

// ── Farmer Endpoints ──
router.post('/upload', authenticate, upload.single('reportFile'), soilCtrl.uploadReport);
router.get('/history', authenticate, soilCtrl.getHistory);
router.post('/analyze', authenticate, soilCtrl.analyzeStandalone);
router.post('/analyze-ai', authenticate, soilCtrl.analyzeWithAI);

// ── Admin Endpoints ──
router.get('/admin/reports', authenticate, authorize(['soil:read']), soilCtrl.adminGetAllReports);
router.put('/admin/reports/:id/analyze', authenticate, authorize(['soil:write']), soilCtrl.adminAnalyzeReport);
router.post('/admin/reports', authenticate, authorize(['soil:write']), soilCtrl.adminCreateReport);
router.get('/admin/farmer/:farmerId/history', authenticate, authorize(['soil:read']), soilCtrl.getFarmerHistory);

export default router;
