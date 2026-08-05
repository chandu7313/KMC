import { successResponse } from '@kissan/shared';
import ticketService from '../services/ticket.service.js';

/**
 * Support Ticket Controller — HTTP endpoints for ticket lifecycle, replies, notes, and activity history.
 */

/**
 * Get ticket analytics dashboard metrics.
 * @route GET /api/support/tickets/dashboard
 * @param {import('express').Request} req - Express request with query period
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getDashboard = async (req, res, next) => {
  try {
    const { period = 'today' } = req.query;
    return successResponse(res, await ticketService.getDashboardStats(period));
  } catch (e) { next(e); }
};

/**
 * Query paginated list of support tickets with filters.
 * @route GET /api/support/tickets
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getTickets = async (req, res, next) => {
  try {
    const result = await ticketService.getTickets(req.query);
    return successResponse(res, result);
  } catch (e) { next(e); }
};

/**
 * Open a new support ticket.
 * @route POST /api/support/tickets
 * @param {import('express').Request} req - Express request with subject, description, priority
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
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

/**
 * Get detailed ticket information by ID.
 * @route GET /api/support/tickets/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getTicketById = async (req, res, next) => {
  try {
    return successResponse(res, await ticketService.getTicketById(req.params.id));
  } catch (e) { next(e); }
};

/**
 * Update support ticket attributes.
 * @route PUT /api/support/tickets/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateTicket(
      req.params.id, req.body,
      { id: req.user?.id, name: req.user?.name }
    );
    return successResponse(res, { ticket });
  } catch (e) { next(e); }
};

/**
 * Delete a support ticket.
 * @route DELETE /api/support/tickets/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const deleteTicket = async (req, res, next) => {
  try {
    await ticketService.deleteTicket(req.params.id);
    return successResponse(res, null, 'Deleted');
  } catch (e) { next(e); }
};

/**
 * Assign ticket to a support agent.
 * @route POST /api/support/tickets/:id/assign
 * @param {import('express').Request} req - Express request with agentId
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const assignTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.assignTicket(
      req.params.id, req.body.agentId,
      { id: req.user?.id, name: req.user?.name }
    );
    return successResponse(res, { ticket });
  } catch (e) { next(e); }
};

/**
 * Escalate ticket priority / tier.
 * @route POST /api/support/tickets/:id/escalate
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const escalateTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.escalateTicket(
      req.params.id,
      { id: req.user?.id, name: req.user?.name }
    );
    return successResponse(res, { ticket });
  } catch (e) { next(e); }
};

/**
 * Resolve ticket with resolution summary.
 * @route POST /api/support/tickets/:id/resolve
 * @param {import('express').Request} req - Express request with resolution notes
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
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

/**
 * Close resolved support ticket.
 * @route POST /api/support/tickets/:id/close
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const closeTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.closeTicket(
      req.params.id,
      { id: req.user?.id, name: req.user?.name }
    );
    return successResponse(res, { ticket });
  } catch (e) { next(e); }
};

/**
 * Get message thread for ticket.
 * @route GET /api/support/tickets/:id/messages
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getMessages = async (req, res, next) => {
  try {
    return successResponse(res, { messages: await ticketService.getMessages(req.params.id) });
  } catch (e) { next(e); }
};

/**
 * Send customer/agent reply in ticket thread.
 * @route POST /api/support/tickets/:id/reply
 * @param {import('express').Request} req - Express request with message text
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const sendReply = async (req, res, next) => {
  try {
    const message = await ticketService.sendReply(req.params.id, req.user?.id, {
      ...req.body,
      senderName: req.user?.name,
    });
    return successResponse(res, { message });
  } catch (e) { next(e); }
};

/**
 * Add internal staff note to ticket.
 * @route POST /api/support/tickets/:id/note
 * @param {import('express').Request} req - Express request with internal note
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const addInternalNote = async (req, res, next) => {
  try {
    const note = await ticketService.addInternalNote(req.params.id, req.user?.id, {
      message: req.body.message,
      senderName: req.user?.name,
    });
    return successResponse(res, { note });
  } catch (e) { next(e); }
};

/**
 * Get audit log activities for ticket.
 * @route GET /api/support/tickets/:id/activity
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getActivity = async (req, res, next) => {
  try {
    return successResponse(res, { activities: await ticketService.getActivity(req.params.id) });
  } catch (e) { next(e); }
};
