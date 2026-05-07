import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as fCtrl from '../controllers/fertilizer.controller.js';

const router = express.Router();

// Public
router.get('/list', fCtrl.listFertilizers);
router.get('/:id', fCtrl.getFertilizer);

// Admin (requires product:write permission)
router.post('/add', authenticate, authorize(['product:write']), fCtrl.addFertilizer);
router.put('/update/:id', authenticate, authorize(['product:write']), fCtrl.updateFertilizer);
router.delete('/delete/:id', authenticate, authorize(['product:write']), fCtrl.removeFertilizer);

export default router;
