import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import ticketRepo from '../repositories/ticket.repository.js';
import agentRepo from '../repositories/agent.repository.js';

const logger = createLogger('support-service');

class TicketService {
  // ── Dashboard ──
  async getDashboardStats() {
    const [total, open, inProgress] = await Promise.all([
      ticketRepo.countTickets(), ticketRepo.countTickets({ status: 'open' }),
      ticketRepo.countTickets({ status: 'in_progress' }),
    ]);
    const agents = await agentRepo.findActive();
    return { stats: { total, open, inProgress }, agents };
  }

  // ── CRUD ──
  async createTicket(data) {
    const ticket = await ticketRepo.createTicket({
      farmerId: data.farmerId, category: data.category, subCategory: data.subCategory,
      subject: data.subject, priority: data.priority || 'medium',
      source: data.source || 'app', assignedTo: data.assignedTo || null,
    });
    if (data.message) {
      await ticketRepo.createMessage({
        ticketId: ticket.id, senderType: data.farmerId ? 'farmer' : 'agent',
        senderId: data.farmerId || data.userId, message: data.message,
      });
    }
    await publishEvent(EXCHANGES.SUPPORT, 'ticket.created', { ticketId: ticket.id, farmerId: data.farmerId, priority: ticket.priority }).catch(() => {});
    return ticket;
  }

  async getTickets(filters) { return ticketRepo.findTickets(filters); }

  async getTicketById(id) {
    const ticket = await ticketRepo.findTicketById(id);
    if (!ticket) throw HttpError.notFound('Ticket not found');
    const sla = await ticketRepo.findSLAByPriority(ticket.priority);
    return { ticket, sla };
  }

  async updateTicket(id, updates) {
    const ticket = await ticketRepo.findTicketById(id);
    if (!ticket) throw HttpError.notFound('Ticket not found');
    const fields = {};
    if (updates.status) {
      fields.status = updates.status;
      if (updates.status === 'resolved' && !ticket.resolvedAt) fields.resolvedAt = new Date().toISOString();
      if (updates.status === 'closed' && !ticket.closedAt) fields.closedAt = new Date().toISOString();
    }
    if (updates.priority) fields.priority = updates.priority;
    if (updates.category) fields.category = updates.category;
    if (updates.subCategory !== undefined) fields.subCategory = updates.subCategory;
    if (updates.tags) fields.tags = updates.tags;
    if (updates.assignedTo) fields.assignedTo = updates.assignedTo;
    const updated = await ticketRepo.updateTicket(id, fields);
    if (updates.status) {
      await ticketRepo.createMessage({ ticketId: id, senderType: 'system', senderId: null, message: `Status changed to "${updates.status}"` });
    }
    return updated;
  }

  async deleteTicket(id) {
    const ticket = await ticketRepo.findTicketById(id);
    if (!ticket) throw HttpError.notFound('Ticket not found');
    await ticketRepo.deleteTicket(id);
  }

  async assignTicket(ticketId, agentId) {
    const ticket = await ticketRepo.findTicketById(ticketId);
    if (!ticket) throw HttpError.notFound('Ticket not found');
    const agent = await agentRepo.findById(agentId);
    if (!agent) throw HttpError.notFound('Agent not found');
    const updated = await ticketRepo.updateTicket(ticketId, {
      assignedTo: agentId, status: ticket.status === 'open' ? 'in_progress' : ticket.status,
    });
    await ticketRepo.createMessage({ ticketId, senderType: 'system', senderId: null, message: `Assigned to ${agent.name}` });
    return updated;
  }

  async escalateTicket(ticketId, managerId) {
    const ticket = await ticketRepo.findTicketById(ticketId);
    if (!ticket) throw HttpError.notFound('Ticket not found');
    const newPriority = ticket.priority === 'low' ? 'medium' : ticket.priority === 'medium' ? 'high' : 'critical';
    const updated = await ticketRepo.updateTicket(ticketId, {
      escalatedTo: managerId || null, escalatedAt: new Date().toISOString(), priority: newPriority,
    });
    await ticketRepo.createMessage({ ticketId, senderType: 'system', senderId: null, message: `Escalated. Priority raised to ${newPriority}.` });
    await publishEvent(EXCHANGES.SUPPORT, 'ticket.escalated', { ticketId, newPriority }).catch(() => {});
    return updated;
  }

  // ── Messages ──
  async getMessages(ticketId) { return ticketRepo.findMessages(ticketId); }

  async sendReply(ticketId, userId, body) {
    const ticket = await ticketRepo.findTicketById(ticketId);
    if (!ticket) throw HttpError.notFound('Ticket not found');
    const msg = await ticketRepo.createMessage({
      ticketId, senderType: 'agent', senderId: userId,
      message: body.message, attachments: body.attachments || [],
    });
    const updates = {};
    if (!ticket.firstResponseAt) updates.firstResponseAt = new Date().toISOString();
    if (body.updateStatus === 'resolved') { updates.status = 'resolved'; updates.resolvedAt = new Date().toISOString(); }
    else if (body.updateStatus === 'closed') { updates.status = 'closed'; updates.closedAt = new Date().toISOString(); }
    else if (ticket.status === 'open') { updates.status = 'in_progress'; }
    if (Object.keys(updates).length) await ticketRepo.updateTicket(ticketId, updates);
    return msg;
  }

  async addInternalNote(ticketId, userId, message) {
    return ticketRepo.createMessage({ ticketId, senderType: 'agent', senderId: userId, message, isInternalNote: true });
  }
}

export default new TicketService();
