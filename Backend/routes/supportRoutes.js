import express from 'express';
import { supportAuth, managerAuth, superAdminAuth } from '../middleware/supportAuth.js';
import {
    // Dashboard
    getDashboardStats,
    // Tickets
    getTickets, createTicket, getTicketById, updateTicket, deleteTicket,
    assignTicket, escalateTicket,
    // Messages
    getTicketMessages, sendReply, addInternalNote,
    // Farmers
    getSupportFarmers, getFarmerProfile, getFarmerActivity,
    blockFarmer, sendFarmerMessage,
    // Bookings
    getSupportBookings, updateSupportBooking, sendBookingReminder,
    // Templates
    getTemplates, createTemplate, updateTemplate, deleteTemplate,
    // Notifications
    sendSupportNotification, getNotificationHistory,
    // Reports
    getReportsDashboard, getAgentPerformanceReport, getTicketAnalytics, exportReportData,
    // Agents
    getAgents, createAgent, updateAgent, updateAgentStatus,
    // SLA
    getSLAConfig, updateSLAConfig
} from '../controllers/supportController.js';

const supportRouter = express.Router();

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────
supportRouter.get('/dashboard', supportAuth, getDashboardStats);

// ─────────────────────────────────────────────
// Tickets
// ─────────────────────────────────────────────
supportRouter.get('/tickets', supportAuth, getTickets);
supportRouter.post('/tickets', supportAuth, createTicket);
supportRouter.get('/tickets/:id', supportAuth, getTicketById);
supportRouter.put('/tickets/:id', supportAuth, updateTicket);
supportRouter.delete('/tickets/:id', superAdminAuth, deleteTicket);
supportRouter.post('/tickets/:id/assign', managerAuth, assignTicket);
supportRouter.post('/tickets/:id/escalate', supportAuth, escalateTicket);

// ─────────────────────────────────────────────
// Messages
// ─────────────────────────────────────────────
supportRouter.get('/tickets/:id/messages', supportAuth, getTicketMessages);
supportRouter.post('/tickets/:id/messages', supportAuth, sendReply);
supportRouter.post('/tickets/:id/notes', supportAuth, addInternalNote);

// ─────────────────────────────────────────────
// Farmers
// ─────────────────────────────────────────────
supportRouter.get('/farmers', supportAuth, getSupportFarmers);
supportRouter.get('/farmers/:id', supportAuth, getFarmerProfile);
supportRouter.get('/farmers/:id/activity', supportAuth, getFarmerActivity);
supportRouter.post('/farmers/:id/block', managerAuth, blockFarmer);
supportRouter.post('/farmers/:id/message', supportAuth, sendFarmerMessage);

// ─────────────────────────────────────────────
// Bookings
// ─────────────────────────────────────────────
supportRouter.get('/bookings', supportAuth, getSupportBookings);
supportRouter.put('/bookings/:id', supportAuth, updateSupportBooking);
supportRouter.post('/bookings/:id/remind', supportAuth, sendBookingReminder);

// ─────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────
supportRouter.get('/templates', supportAuth, getTemplates);
supportRouter.post('/templates', managerAuth, createTemplate);
supportRouter.put('/templates/:id', managerAuth, updateTemplate);
supportRouter.delete('/templates/:id', managerAuth, deleteTemplate);

// ─────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────
supportRouter.post('/notifications/send', managerAuth, sendSupportNotification);
supportRouter.get('/notifications/history', supportAuth, getNotificationHistory);

// ─────────────────────────────────────────────
// Reports
// ─────────────────────────────────────────────
supportRouter.get('/reports/dashboard', managerAuth, getReportsDashboard);
supportRouter.get('/reports/agents', managerAuth, getAgentPerformanceReport);
supportRouter.get('/reports/tickets', managerAuth, getTicketAnalytics);
supportRouter.get('/reports/export', managerAuth, exportReportData);

// ─────────────────────────────────────────────
// Agents
// ─────────────────────────────────────────────
supportRouter.get('/agents', managerAuth, getAgents);
supportRouter.post('/agents', superAdminAuth, createAgent);
supportRouter.put('/agents/:id', managerAuth, updateAgent);
supportRouter.put('/agents/:id/status', supportAuth, updateAgentStatus);

// ─────────────────────────────────────────────
// SLA Configuration
// ─────────────────────────────────────────────
supportRouter.get('/settings/sla', managerAuth, getSLAConfig);
supportRouter.put('/settings/sla', superAdminAuth, updateSLAConfig);

export default supportRouter;
