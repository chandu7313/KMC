import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as mCtrl from '../controllers/management.controller.js';

const router = express.Router();
router.use(authenticate);

// Farmers
router.get('/farmers', authorize(['support:read']), mCtrl.getFarmers);
router.get('/farmers/:id', authorize(['support:read']), mCtrl.getFarmerProfile);
router.post('/farmers/:id/block', authorize(['support:admin']), mCtrl.blockFarmer);
router.post('/farmers/:id/message', authorize(['support:write']), mCtrl.sendFarmerMessage);

// Bookings
router.get('/bookings', authorize(['support:read']), mCtrl.getBookings);
router.put('/bookings/:id', authorize(['support:write']), mCtrl.updateBooking);
router.post('/bookings/:id/remind', authorize(['support:write']), mCtrl.sendBookingReminder);

// Templates
router.get('/templates', authorize(['support:read']), mCtrl.getTemplates);
router.post('/templates', authorize(['support:admin']), mCtrl.createTemplate);
router.put('/templates/:id', authorize(['support:admin']), mCtrl.updateTemplate);
router.delete('/templates/:id', authorize(['support:admin']), mCtrl.deleteTemplate);

// Notifications
router.post('/notifications/send', authorize(['support:admin']), mCtrl.sendNotification);
router.get('/notifications/history', authorize(['support:read']), mCtrl.getNotificationHistory);

// Reports
router.get('/reports/dashboard', authorize(['support:admin']), mCtrl.getReportsDashboard);
router.get('/reports/agents', authorize(['support:admin']), mCtrl.getAgentPerformance);

// Agents
router.get('/agents', authorize(['support:admin']), mCtrl.getAgents);
router.post('/agents', authorize(['support:admin']), mCtrl.createAgent);
router.put('/agents/:id', authorize(['support:admin']), mCtrl.updateAgent);
router.put('/agents/:id/status', authorize(['support:write']), mCtrl.updateAgentStatus);

// SLA
router.get('/settings/sla', authorize(['support:admin']), mCtrl.getSLAConfig);
router.put('/settings/sla', authorize(['support:admin']), mCtrl.updateSLAConfig);

export default router;
