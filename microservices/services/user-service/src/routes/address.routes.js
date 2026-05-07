import express from 'express';
import { authenticate, validate } from '@kissan/shared';
import * as addressCtrl from '../controllers/address.controller.js';
import { saveAddressSchema } from '../validators/user.validator.js';

const router = express.Router();

router.use(authenticate);

// GET    /addresses           — Get all addresses
router.get('/', addressCtrl.getAddresses);

// POST   /addresses           — Add new address
router.post('/', validate(saveAddressSchema), addressCtrl.addAddress);

// PUT    /addresses/:id       — Update address
router.put('/:id', addressCtrl.updateAddress);

// DELETE /addresses/:id       — Delete address
router.delete('/:id', addressCtrl.deleteAddress);

export default router;
