import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as notificationController from '../controllers/notification.controller.js';

const router = express.Router();

// Internal service-to-service endpoint (authenticated)
router.post('/send', authenticate, notificationController.sendNotification);

// Notification history (admin only)
router.get(
  '/history/:userId',
  authenticate,
  authorize(['notification:read']),
  notificationController.getNotificationHistory
);

// Test endpoint (admin only)
router.post(
  '/test',
  authenticate,
  authorize(['notification:write']),
  notificationController.sendTestNotification
);

export default router;
