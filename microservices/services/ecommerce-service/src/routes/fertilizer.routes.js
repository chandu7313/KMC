import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as fCtrl from '../controllers/fertilizer.controller.js';

const router = express.Router();

// Public
router.get('/list', fCtrl.listFertilizers);
router.get('/:id', fCtrl.getFertilizer);

// Admin (requires products:manage permission)
router.post('/add', authenticate, authorize(['products:manage']), fCtrl.addFertilizer);
router.put('/update/:id', authenticate, authorize(['products:manage']), fCtrl.updateFertilizer);
router.delete('/delete/:id', authenticate, authorize(['products:manage']), fCtrl.removeFertilizer);

export default router;
