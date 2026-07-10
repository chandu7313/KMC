import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as dashboardCtrl from '../controllers/dashboard.controller.js';

const router = express.Router();

// All farmer dashboard routes require authentication and farmer/user role
router.use(authenticate);

// GET /farmer/dashboard
router.get('/dashboard', dashboardCtrl.getDashboardData);

// POST /farmer/alerts/:id/read
router.post('/alerts/:id/read', dashboardCtrl.markAlertRead);

// POST /farmer/alerts/read-all
router.post('/alerts/read-all', dashboardCtrl.markAllAlertsRead);

// POST /farmer/farm-status
router.post('/farm-status', dashboardCtrl.submitFarmStatus);

export default router;
