import { successResponse } from '@kissan/shared';
import ticketService from '../services/ticket.service.js';

// Dashboard
export const getDashboard = async (req, res, next) => {
  try { return successResponse(res, await ticketService.getDashboardStats()); } catch (e) { next(e); }
};

// CRUD
export const getTickets = async (req, res, next) => {
  try { const result = await ticketService.getTickets(req.query); return successResponse(res, result); } catch (e) { next(e); }
};
export const createTicket = async (req, res, next) => {
  try { return successResponse(res, { ticket: await ticketService.createTicket({ ...req.body, userId: req.user?.id }) }, 'Ticket created', 201); } catch (e) { next(e); }
};
export const getTicketById = async (req, res, next) => {
  try { return successResponse(res, await ticketService.getTicketById(req.params.id)); } catch (e) { next(e); }
};
export const updateTicket = async (req, res, next) => {
  try { return successResponse(res, { ticket: await ticketService.updateTicket(req.params.id, req.body) }); } catch (e) { next(e); }
};
export const deleteTicket = async (req, res, next) => {
  try { await ticketService.deleteTicket(req.params.id); return successResponse(res, null, 'Deleted'); } catch (e) { next(e); }
};
export const assignTicket = async (req, res, next) => {
  try { return successResponse(res, { ticket: await ticketService.assignTicket(req.params.id, req.body.agentId) }); } catch (e) { next(e); }
};
export const escalateTicket = async (req, res, next) => {
  try { return successResponse(res, { ticket: await ticketService.escalateTicket(req.params.id, req.body.managerId) }); } catch (e) { next(e); }
};

// Messages
export const getMessages = async (req, res, next) => {
  try { return successResponse(res, { messages: await ticketService.getMessages(req.params.id) }); } catch (e) { next(e); }
};
export const sendReply = async (req, res, next) => {
  try { return successResponse(res, { message: await ticketService.sendReply(req.params.id, req.user?.id, req.body) }); } catch (e) { next(e); }
};
export const addInternalNote = async (req, res, next) => {
  try { return successResponse(res, { note: await ticketService.addInternalNote(req.params.id, req.user?.id, req.body.message) }); } catch (e) { next(e); }
};
