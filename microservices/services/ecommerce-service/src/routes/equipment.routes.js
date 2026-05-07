import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as eCtrl from '../controllers/equipment.controller.js';

const router = express.Router();

// Public
router.get('/list', eCtrl.listEquipments);
router.get('/:id', eCtrl.getEquipment);

// Admin (requires product:write permission)
router.post('/add', authenticate, authorize(['product:write']), eCtrl.addEquipment);
router.put('/update/:id', authenticate, authorize(['product:write']), eCtrl.updateEquipment);
router.delete('/delete/:id', authenticate, authorize(['product:write']), eCtrl.removeEquipment);

export default router;
