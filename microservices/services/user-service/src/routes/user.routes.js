import express from 'express';
import { authenticate, validate } from '@kissan/shared';
import * as userCtrl from '../controllers/user.controller.js';
import { updateProfileSchema, updateLanguageSchema, updatePreferencesSchema } from '../validators/user.validator.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// GET  /profile/data         — Get user profile + addresses
router.get('/data', userCtrl.getUserData);

// PUT  /profile/update       — Update profile fields
router.put('/update', validate(updateProfileSchema), userCtrl.updateProfile);

// POST /profile/language     — Update language
router.post('/language', validate(updateLanguageSchema), userCtrl.updateLanguage);

// POST /profile/preferences  — Update preferences
router.post('/preferences', validate(updatePreferencesSchema), userCtrl.updatePreferences);

export default router;
