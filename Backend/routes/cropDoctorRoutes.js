import express from 'express';
import { diagnoseCrop, getHistory, getDetail } from '../controllers/cropDoctorController.js';
import userAuth from '../middleware/userAuth.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Upload crop image for diagnosis
router.post('/diagnose', userAuth, upload.single('cropImage'), diagnoseCrop);

// Get user's diagnosis history
router.get('/history', userAuth, getHistory);

// Get single diagnosis detail
router.get('/detail/:id', userAuth, getDetail);

export default router;
