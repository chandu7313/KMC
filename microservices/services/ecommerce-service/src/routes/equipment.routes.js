import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as eCtrl from '../controllers/equipment.controller.js';

const router = express.Router();

// Public
router.get('/list', eCtrl.listEquipments);
router.get('/:id', eCtrl.getEquipment);

// Admin (requires products:manage permission)
router.post('/add', authenticate, authorize(['products:manage']), eCtrl.addEquipment);
router.put('/update/:id', authenticate, authorize(['products:manage']), eCtrl.updateEquipment);
router.delete('/delete/:id', authenticate, authorize(['products:manage']), eCtrl.removeEquipment);

export default router;
