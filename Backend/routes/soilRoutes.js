import express from 'express';
import {
    uploadReport,
    getHistory,
    downloadHealthCard,
    adminGetAllReports,
    adminAnalyzeReport,
    adminCreateReport,
    analyzeStandalone,
    getFarmerHistory
} from '../controllers/soilController.js';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', userAuth, upload.single('reportFile'), uploadReport);
router.post('/analyze', analyzeStandalone);
router.get('/history', userAuth, getHistory);
router.get('/history/:farmerId', adminAuth, getFarmerHistory);
router.get('/download/:id', userAuth, downloadHealthCard);

router.get('/', adminAuth, adminGetAllReports);
router.put('/:id/analyze', adminAuth, adminAnalyzeReport);
router.post('/admin/create', adminAuth, adminCreateReport);

export default router;
