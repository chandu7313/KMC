import { successResponse } from '@kissan/shared';
import mgmtService from '../services/management.service.js';

// ── Farmers ──
export const getFarmers = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.getFarmers(req.query)); } catch (e) { next(e); }
};

export const getFarmerProfile = async (req, res, next) => {
  try { return successResponse(res, { farmer: await mgmtService.getFarmerProfile(req.params.id) }); } catch (e) { next(e); }
};

export const blockFarmer = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.blockFarmer(req.params.id)); } catch (e) { next(e); }
};

export const sendFarmerMessage = async (req, res, next) => {
  try { return successResponse(res, null, 'Message sent'); } catch (e) { next(e); }
};

// ── Bookings ──
export const getBookings = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.getBookings(req.query)); } catch (e) { next(e); }
};

export const updateBooking = async (req, res, next) => {
  try { return successResponse(res, { booking: await mgmtService.updateBooking(req.params.id, req.body) }); } catch (e) { next(e); }
};

export const sendBookingReminder = async (req, res, next) => {
  try { return successResponse(res, null, 'Reminder sent'); } catch (e) { next(e); }
};

// ── Templates ──
export const getTemplates = async (req, res, next) => {
  try { return successResponse(res, { templates: await mgmtService.getTemplates(req.query) }); } catch (e) { next(e); }
};

export const createTemplate = async (req, res, next) => {
  try { return successResponse(res, { template: await mgmtService.createTemplate(req.body, req.user?.id) }, 'Created', 201); } catch (e) { next(e); }
};

export const updateTemplate = async (req, res, next) => {
  try { return successResponse(res, { template: await mgmtService.updateTemplate(req.params.id, req.body) }); } catch (e) { next(e); }
};

export const deleteTemplate = async (req, res, next) => {
  try { await mgmtService.deleteTemplate(req.params.id); return successResponse(res, null, 'Deleted'); } catch (e) { next(e); }
};

// ── Notifications ──
export const sendNotification = async (req, res, next) => {
  try { return successResponse(res, { notification: await mgmtService.sendNotification(req.body, req.user?.id) }); } catch (e) { next(e); }
};

export const getNotificationHistory = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.getNotificationHistory(req.query)); } catch (e) { next(e); }
};

// ── Reports ──
export const getReportsDashboard = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.getReportsDashboard()); } catch (e) { next(e); }
};

export const getAgentPerformance = async (req, res, next) => {
  try { return successResponse(res, { agents: await mgmtService.getAgentPerformance() }); } catch (e) { next(e); }
};

// ── Agents ──
export const getAgents = async (req, res, next) => {
  try { return successResponse(res, { agents: await mgmtService.getAgents() }); } catch (e) { next(e); }
};

export const createAgent = async (req, res, next) => {
  try { return successResponse(res, { agent: await mgmtService.createAgent(req.body) }, 'Created', 201); } catch (e) { next(e); }
};

export const updateAgent = async (req, res, next) => {
  try { return successResponse(res, { agent: await mgmtService.updateAgent(req.params.id, req.body) }); } catch (e) { next(e); }
};

export const updateAgentStatus = async (req, res, next) => {
  try { return successResponse(res, await mgmtService.updateAgentStatus(req.params.id, req.body.status)); } catch (e) { next(e); }
};

// ── SLA ──
export const getSLAConfig = async (req, res, next) => {
  try { return successResponse(res, { config: await mgmtService.getSLAConfig() }); } catch (e) { next(e); }
};

export const updateSLAConfig = async (req, res, next) => {
  try { return successResponse(res, { config: await mgmtService.updateSLAConfig(req.body.configs) }); } catch (e) { next(e); }
};
