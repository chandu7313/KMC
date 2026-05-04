// ─────────────────────────────────────────────────────────────
// Support Controller — Barrel export
// Re-exports all handler functions from split controller files
// ─────────────────────────────────────────────────────────────

export {
    getDashboardStats,
    getTickets, createTicket, getTicketById, updateTicket, deleteTicket,
    assignTicket, escalateTicket,
    getTicketMessages, sendReply, addInternalNote
} from './supportTicketController.js';

export {
    getSupportFarmers, getFarmerProfile, getFarmerActivity,
    blockFarmer, sendFarmerMessage,
    getSupportBookings, updateSupportBooking, sendBookingReminder,
    getTemplates, createTemplate, updateTemplate, deleteTemplate,
    sendSupportNotification, getNotificationHistory,
    getReportsDashboard, getAgentPerformanceReport, getTicketAnalytics, exportReportData,
    getAgents, createAgent, updateAgent, updateAgentStatus,
    getSLAConfig, updateSLAConfig
} from './supportManagementController.js';
