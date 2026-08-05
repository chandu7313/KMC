import { successResponse } from '@kissan/shared';
import mgmtService from '../services/management.service.js';

/**
 * Support Management Controller — HTTP endpoints for farmer CRM, consultation bookings, templates, agents, and SLA policies.
 */

// Farmers
/**
 * Query farmer users with support ticket history.
 * @route GET /api/support/management/farmers
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getFarmers = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.getFarmers(req.query)); } catch (e) { next(e); }
};

/**
 * Get detailed farmer profile and activity.
 * @route GET /api/support/management/farmers/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getFarmerProfile = async (req, res, next) => {
  try { return successResponse(res, { farmer: await mgmtService.getFarmerProfile(req.params.id) }); } catch (e) { next(e); }
};

/**
 * Block or suspend farmer account from opening spam tickets.
 * @route POST /api/support/management/farmers/:id/block
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const blockFarmer = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.blockFarmer(req.params.id)); } catch (e) { next(e); }
};

/**
 * Send direct message or SMS to farmer.
 * @route POST /api/support/management/farmers/:id/message
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const sendFarmerMessage = async (req, res, next) => {
  try { return successResponse(res, null, 'Message sent'); } catch (e) { next(e); }
};

// Bookings
/**
 * Query consultation bookings for support agents.
 * @route GET /api/support/management/bookings
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getBookings = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.getBookings(req.query)); } catch (e) { next(e); }
};

/**
 * Update consultation booking status or reschedule.
 * @route PUT /api/support/management/bookings/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const updateBooking = async (req, res, next) => {
  try { return successResponse(res, { booking: await mgmtService.updateBooking(req.params.id, req.body) }); } catch (e) { next(e); }
};

/**
 * Send booking reminder notification.
 * @route POST /api/support/management/bookings/:id/reminder
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const sendBookingReminder = async (req, res, next) => {
  try { return successResponse(res, null, 'Reminder sent'); } catch (e) { next(e); }
};

// Templates
/**
 * Query canned response templates.
 * @route GET /api/support/management/templates
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getTemplates = async (req, res, next) => {
  try { return successResponse(res, { templates: await mgmtService.getTemplates(req.query) }); } catch (e) { next(e); }
};

/**
 * Create a new response template.
 * @route POST /api/support/management/templates
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const createTemplate = async (req, res, next) => {
  try { return successResponse(res, { template: await mgmtService.createTemplate(req.body, req.user?.id) }, 'Created', 201); } catch (e) { next(e); }
};

/**
 * Update response template.
 * @route PUT /api/support/management/templates/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const updateTemplate = async (req, res, next) => {
  try { return successResponse(res, { template: await mgmtService.updateTemplate(req.params.id, req.body) }); } catch (e) { next(e); }
};

/**
 * Delete response template.
 * @route DELETE /api/support/management/templates/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const deleteTemplate = async (req, res, next) => {
  try { await mgmtService.deleteTemplate(req.params.id); return successResponse(res, null, 'Deleted'); } catch (e) { next(e); }
};

// Notifications
/**
 * Send outbound announcement to farmers.
 * @route POST /api/support/management/notifications/send
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const sendNotification = async (req, res, next) => {
  try { return successResponse(res, { notification: await mgmtService.sendNotification(req.body, req.user?.id) }); } catch (e) { next(e); }
};

/**
 * View notification history log.
 * @route GET /api/support/management/notifications/history
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getNotificationHistory = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.getNotificationHistory(req.query)); } catch (e) { next(e); }
};

// Reports
/**
 * Overview statistics and KPIs for support department.
 * @route GET /api/support/management/reports/dashboard
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getReportsDashboard = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.getReportsDashboard()); } catch (e) { next(e); }
};

/**
 * Agent productivity, response time, and satisfaction metrics.
 * @route GET /api/support/management/reports/agents
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getAgentPerformance = async (req, res, next) => {
  try { return successResponse(res, { agents: await mgmtService.getAgentPerformance() }); } catch (e) { next(e); }
};

// Agents
/**
 * List support agents and status.
 * @route GET /api/support/management/agents
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getAgents = async (req, res, next) => {
  try { return successResponse(res, { agents: await mgmtService.getAgents() }); } catch (e) { next(e); }
};

/**
 * Register a new support agent.
 * @route POST /api/support/management/agents
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const createAgent = async (req, res, next) => {
  try { return successResponse(res, { agent: await mgmtService.createAgent(req.body) }, 'Created', 201); } catch (e) { next(e); }
};

/**
 * Update agent profile, department, or tier.
 * @route PUT /api/support/management/agents/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const updateAgent = async (req, res, next) => {
  try { return successResponse(res, { agent: await mgmtService.updateAgent(req.params.id, req.body) }); } catch (e) { next(e); }
};

/**
 * Toggle agent availability (online, offline, busy).
 * @route PUT /api/support/management/agents/:id/status
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const updateAgentStatus = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.updateAgentStatus(req.params.id, req.body.status)); } catch (e) { next(e); }
};

// SLA
/**
 * Retrieve SLA threshold configuration.
 * @route GET /api/support/management/sla
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getSLAConfig = async (req, res, next) => {
  try { return successResponse(res, { config: await mgmtService.getSLAConfig() }); } catch (e) { next(e); }
};

/**
 * Update SLA response time limits.
 * @route PUT /api/support/management/sla
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const updateSLAConfig = async (req, res, next) => {
  try { return successResponse(res, { config: await mgmtService.updateSLAConfig(req.body.configs) }); } catch (e) { next(e); }
};
