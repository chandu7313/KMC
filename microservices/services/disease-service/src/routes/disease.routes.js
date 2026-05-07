import express from 'express';
import multer from 'multer';
import { authenticate } from '@kissan/shared';
import * as diseaseCtrl from '../controllers/disease.controller.js';

const router = express.Router();
const upload = multer({ dest: '/tmp/crop-uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

router.use(authenticate);

router.post('/diagnose', upload.single('cropImage'), diseaseCtrl.diagnoseCrop);
router.get('/history', diseaseCtrl.getHistory);
router.get('/detail/:id', diseaseCtrl.getDetail);

export default router;
