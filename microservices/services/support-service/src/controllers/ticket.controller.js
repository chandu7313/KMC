import { successResponse } from '@kissan/shared';
import ticketService from '../services/ticket.service.js';

// Dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const { period = 'today' } = req.query;
    return successResponse(res, await ticketService.getDashboardStats(period));
  } catch (e) { next(e); }
};

// CRUD
export const getTickets = async (req, res, next) => {
  try {
    const result = await ticketService.getTickets(req.query);
    return successResponse(res, result);
  } catch (e) { next(e); }
};

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket({
      ...req.body,
      userId: req.user?.id,
      agentName: req.user?.name,
    });
    return successResponse(res, { ticket }, 'Ticket created', 201);
  } catch (e) { next(e); }
};

export const getTicketById = async (req, res, next) => {
  try {
    return successResponse(res, await ticketService.getTicketById(req.params.id));
  } catch (e) { next(e); }
};

export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateTicket(
      req.params.id, req.body,
      { id: req.user?.id, name: req.user?.name }
    );
    return successResponse(res, { ticket });
  } catch (e) { next(e); }
};

export const deleteTicket = async (req, res, next) => {
  try {
    await ticketService.deleteTicket(req.params.id);
    return successResponse(res, null, 'Deleted');
  } catch (e) { next(e); }
};

export const assignTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.assignTicket(
      req.params.id, req.body.agentId,
      { id: req.user?.id, name: req.user?.name }
    );
    return successResponse(res, { ticket });
  } catch (e) { next(e); }
};

export const escalateTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.escalateTicket(
      req.params.id,
      { id: req.user?.id, name: req.user?.name }
    );
    return successResponse(res, { ticket });
  } catch (e) { next(e); }
};

export const resolveTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.resolveTicket(
      req.params.id,
      { id: req.user?.id, name: req.user?.name },
      req.body.resolution
    );
    return successResponse(res, { ticket });
  } catch (e) { next(e); }
};

export const closeTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.closeTicket(
      req.params.id,
      { id: req.user?.id, name: req.user?.name }
    );
    return successResponse(res, { ticket });
  } catch (e) { next(e); }
};

// Messages
export const getMessages = async (req, res, next) => {
  try {
    return successResponse(res, { messages: await ticketService.getMessages(req.params.id) });
  } catch (e) { next(e); }
};

export const sendReply = async (req, res, next) => {
  try {
    const message = await ticketService.sendReply(req.params.id, req.user?.id, {
      ...req.body,
      senderName: req.user?.name,
    });
    return successResponse(res, { message });
  } catch (e) { next(e); }
};

export const addInternalNote = async (req, res, next) => {
  try {
    const note = await ticketService.addInternalNote(req.params.id, req.user?.id, {
      message: req.body.message,
      senderName: req.user?.name,
    });
    return successResponse(res, { note });
  } catch (e) { next(e); }
};

// Activity
export const getActivity = async (req, res, next) => {
  try {
    return successResponse(res, { activities: await ticketService.getActivity(req.params.id) });
  } catch (e) { next(e); }
};
