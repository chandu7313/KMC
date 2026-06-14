import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import ticketRepo from '../repositories/ticket.repository.js';
import agentRepo from '../repositories/agent.repository.js';

const logger = createLogger('support-service');

const CATEGORY_LABELS = {
  order_issue: 'Order Issues', payment: 'Payment', delivery: 'Delivery',
  app_issue: 'App', expert_booking: 'Expert', general: 'General',
  disease_scan: 'Disease Scan', soil_test: 'Soil Test', refund: 'Refund',
};

const CATEGORY_COLORS = {
  order_issue: '#2E7D32', payment: '#1565C0', delivery: '#F57F17',
  app_issue: '#6A1B9A', expert_booking: '#C62828', general: '#455A64',
  disease_scan: '#00838F', soil_test: '#4E342E', refund: '#E65100',
};

class TicketService {
  // ── Dashboard ──
  async getDashboardStats(period = 'today') {
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

    const [
      statusCounts,
      resolvedToday,
      todayNewCount,
      avgResponseMins,
      csatScore,
      ticketVolume,
      categoryData,
      criticalTickets,
      slaBreaching,
      liveActivity,
      totalTickets,
    ] = await Promise.all([
      ticketRepo.countByStatus(),
      ticketRepo.countResolvedSince(todayStart),
      ticketRepo.countCreatedSince(todayStart),
      ticketRepo.getAvgResponseMins(7),
      ticketRepo.getAvgCSAT(30),
      ticketRepo.getTicketVolumeByDay(7),
      ticketRepo.countByCategory(),
      ticketRepo.findCriticalTickets(10),
      ticketRepo.findSLABreaching(120),
      ticketRepo.findRecentActivity(20),
      ticketRepo.countTickets(),
    ]);

    // Convert avg response mins to hours
    const avgResponseHours = avgResponseMins > 0
      ? Math.round((avgResponseMins / 60) * 10) / 10
      : 0;

    // Build category breakdown with labels, colors, and percentages
    const total = categoryData.reduce((s, c) => s + c.value, 0) || 1;
    const categoryBreakdown = categoryData.map(c => ({
      name: CATEGORY_LABELS[c.name] || c.name,
      value: c.value,
      percentage: Math.round((c.value / total) * 100),
      color: CATEGORY_COLORS[c.name] || '#607D8B',
    }));

    // Add minutesLeft to SLA breaching tickets
    const now = new Date();
    const slaWithMinutes = (slaBreaching || []).map(t => ({
      ...t,
      minutesLeft: Math.max(0, Math.floor((new Date(t.slaDueAt || t.sla_due_at) - now) / 60000)),
    }));

    logger.info('Dashboard stats fetched', { period, totalTickets });

    return {
      stats: {
        totalTickets,
        todayNewCount,
        openTickets: statusCounts.open || 0,
        inProgress: statusCounts.in_progress || 0,
        resolvedToday,
        avgResponseHours,
        csatScore,
      },
      ticketVolume,
      categoryBreakdown,
      criticalTickets,
      slaBreaching: slaWithMinutes,
      liveActivity,
    };
  }

  // ── CRUD ──
  async createTicket(data) {
    // Auto-generate ticket ref
    const ticketRef = await ticketRepo.getNextTicketRef();

    // Get SLA config for priority
    const slaConfig = await ticketRepo.findSLAByPriority(data.priority || 'medium');
    const slaDueAt = slaConfig
      ? new Date(Date.now() + parseFloat(slaConfig.resolutionHours || slaConfig.resolution_hours) * 60 * 60 * 1000)
      : new Date(Date.now() + 48 * 60 * 60 * 1000); // default 48h

    const ticket = await ticketRepo.createTicket({
      ticketRef,
      farmerId: data.farmerId,
      farmerName: data.farmerName,
      farmerPhone: data.farmerPhone,
      category: data.category || 'general',
      subject: data.subject,
      description: data.description,
      priority: data.priority || 'medium',
      source: data.source || 'app',
      assignedTo: data.assignedTo || null,
      assignedAgentName: data.assignedAgentName || null,
      tags: data.tags || [],
      slaDueAt,
      linkedOrderId: data.linkedOrderId,
      linkedBookingId: data.linkedBookingId,
    });

    // Create initial message if provided
    if (data.message) {
      await ticketRepo.createMessage({
        ticketId: ticket.id,
        senderType: data.farmerId ? 'farmer' : 'agent',
        senderId: data.farmerId || data.userId,
        senderName: data.farmerName || 'Agent',
        message: data.message,
      });
    }

    // Log activity
    await ticketRepo.createActivity({
      ticketId: ticket.id,
      agentId: data.userId,
      agentName: data.agentName || 'System',
      action: 'created',
      description: `Ticket ${ticketRef} created`,
    });

    logger.info('Ticket created', {
      ticketRef, category: ticket.category, priority: ticket.priority,
    });

    await publishEvent(EXCHANGES.SUPPORT, 'ticket.created', {
      ticketId: ticket.id, farmerId: data.farmerId, priority: ticket.priority,
    }).catch(() => {});

    return ticket;
  }

  async getTickets(filters) {
    return ticketRepo.findTickets(filters);
  }

  async getTicketById(id) {
    const ticket = await ticketRepo.findTicketById(id);
    if (!ticket) throw HttpError.notFound('Ticket not found');
    const [sla, messages, activities] = await Promise.all([
      ticketRepo.findSLAByPriority(ticket.priority),
      ticketRepo.findMessages(id),
      ticketRepo.findActivity(id),
    ]);
    return { ticket, sla, messages, activities };
  }

  async updateTicket(id, updates, agent = {}) {
    const ticket = await ticketRepo.findTicketById(id);
    if (!ticket) throw HttpError.notFound('Ticket not found');

    const fields = {};
    if (updates.status) {
      fields.status = updates.status;
      if (updates.status === 'resolved' && !ticket.resolvedAt) fields.resolvedAt = new Date();
      if (updates.status === 'closed' && !ticket.closedAt) fields.closedAt = new Date();
    }
    if (updates.priority) fields.priority = updates.priority;
    if (updates.category) fields.category = updates.category;
    if (updates.tags) fields.tags = updates.tags;
    if (updates.assignedTo) fields.assignedTo = updates.assignedTo;
    if (updates.assignedAgentName) fields.assignedAgentName = updates.assignedAgentName;

    const updated = await ticketRepo.updateTicket(id, fields);

    // Log status change
    if (updates.status) {
      await ticketRepo.createActivity({
        ticketId: id,
        agentId: agent.id,
        agentName: agent.name || 'System',
        action: 'status_changed',
        description: `Status changed from "${ticket.status}" to "${updates.status}"`,
        metadata: { oldStatus: ticket.status, newStatus: updates.status },
      });
      logger.info('Ticket status updated', {
        ticketRef: ticket.ticketRef || ticket.ticket_ref,
        oldStatus: ticket.status, newStatus: updates.status,
      });
    }

    return updated;
  }

  async deleteTicket(id) {
    const ticket = await ticketRepo.findTicketById(id);
    if (!ticket) throw HttpError.notFound('Ticket not found');
    await ticketRepo.deleteTicket(id);
  }

  async assignTicket(ticketId, agentId, requestingAgent = {}) {
    const ticket = await ticketRepo.findTicketById(ticketId);
    if (!ticket) throw HttpError.notFound('Ticket not found');
    const agent = await agentRepo.findById(agentId);
    if (!agent) throw HttpError.notFound('Agent not found');

    const updated = await ticketRepo.updateTicket(ticketId, {
      assignedTo: agentId,
      assignedAgentName: agent.name,
      status: ticket.status === 'open' ? 'in_progress' : ticket.status,
    });

    await ticketRepo.createActivity({
      ticketId,
      agentId: requestingAgent.id || agentId,
      agentName: requestingAgent.name || agent.name,
      action: 'assigned',
      description: `Assigned to ${agent.name}`,
    });

    await ticketRepo.createMessage({
      ticketId, senderType: 'system', senderId: null,
      senderName: 'System', message: `Assigned to ${agent.name}`,
    });

    logger.info('Ticket assigned', { ticketRef: ticket.ticketRef || ticket.ticket_ref, agentName: agent.name });
    return updated;
  }

  async escalateTicket(ticketId, agent = {}) {
    const ticket = await ticketRepo.findTicketById(ticketId);
    if (!ticket) throw HttpError.notFound('Ticket not found');

    const newPriority = ticket.priority === 'low' ? 'medium' : ticket.priority === 'medium' ? 'high' : 'critical';
    const updated = await ticketRepo.updateTicket(ticketId, { priority: newPriority });

    await ticketRepo.createActivity({
      ticketId,
      agentId: agent.id,
      agentName: agent.name || 'System',
      action: 'escalated',
      description: `Escalated from ${ticket.priority} to ${newPriority}`,
      metadata: { oldPriority: ticket.priority, newPriority },
    });

    await ticketRepo.createMessage({
      ticketId, senderType: 'system', senderId: null,
      senderName: 'System', message: `Escalated. Priority raised to ${newPriority}.`,
    });

    logger.info('Ticket escalated', { ticketRef: ticket.ticketRef || ticket.ticket_ref, newPriority });
    await publishEvent(EXCHANGES.SUPPORT, 'ticket.escalated', { ticketId, newPriority }).catch(() => {});
    return updated;
  }

  async resolveTicket(ticketId, agent = {}, resolution = '') {
    const ticket = await ticketRepo.findTicketById(ticketId);
    if (!ticket) throw HttpError.notFound('Ticket not found');

    const updated = await ticketRepo.updateTicket(ticketId, {
      status: 'resolved',
      resolvedAt: new Date(),
    });

    await ticketRepo.createActivity({
      ticketId,
      agentId: agent.id,
      agentName: agent.name || 'System',
      action: 'resolved',
      description: resolution || `Ticket resolved by ${agent.name || 'agent'}`,
    });

    if (resolution) {
      await ticketRepo.createMessage({
        ticketId, senderType: 'agent', senderId: agent.id,
        senderName: agent.name || 'Agent', message: resolution,
      });
    }

    logger.info('Ticket resolved', { ticketRef: ticket.ticketRef || ticket.ticket_ref, agentName: agent.name });
    return updated;
  }

  async closeTicket(ticketId, agent = {}) {
    const ticket = await ticketRepo.findTicketById(ticketId);
    if (!ticket) throw HttpError.notFound('Ticket not found');

    const updated = await ticketRepo.updateTicket(ticketId, {
      status: 'closed',
      closedAt: new Date(),
    });

    await ticketRepo.createActivity({
      ticketId,
      agentId: agent.id,
      agentName: agent.name || 'System',
      action: 'closed',
      description: `Ticket closed by ${agent.name || 'agent'}`,
    });

    logger.info('Ticket closed', { ticketRef: ticket.ticketRef || ticket.ticket_ref });
    return updated;
  }

  // ── Messages ──
  async getMessages(ticketId) {
    return ticketRepo.findMessages(ticketId);
  }

  async sendReply(ticketId, userId, body) {
    const ticket = await ticketRepo.findTicketById(ticketId);
    if (!ticket) throw HttpError.notFound('Ticket not found');

    const msg = await ticketRepo.createMessage({
      ticketId,
      senderType: body.senderType || 'agent',
      senderId: userId,
      senderName: body.senderName || 'Agent',
      message: body.message,
      attachments: body.attachments || [],
      isInternalNote: false,
    });

    const updates = {};
    if (!ticket.firstResponseAt && !ticket.first_response_at) updates.firstResponseAt = new Date();
    if (ticket.status === 'open') updates.status = 'in_progress';
    if (Object.keys(updates).length) await ticketRepo.updateTicket(ticketId, updates);

    // Log activity
    await ticketRepo.createActivity({
      ticketId,
      agentId: userId,
      agentName: body.senderName || 'Agent',
      action: 'replied',
      description: `Replied to ticket`,
    });

    // Increment template usage if used
    if (body.templateId) {
      await ticketRepo.incrementTemplateUsage(body.templateId);
    }

    return msg;
  }

  async addInternalNote(ticketId, userId, body) {
    const ticket = await ticketRepo.findTicketById(ticketId);
    if (!ticket) throw HttpError.notFound('Ticket not found');

    const note = await ticketRepo.createMessage({
      ticketId,
      senderType: 'agent',
      senderId: userId,
      senderName: body.senderName || 'Agent',
      message: body.message || body,
      isInternalNote: true,
    });

    await ticketRepo.createActivity({
      ticketId,
      agentId: userId,
      agentName: body.senderName || 'Agent',
      action: 'note_added',
      description: 'Internal note added',
    });

    return note;
  }

  // ── Activity ──
  async getActivity(ticketId) {
    return ticketRepo.findActivity(ticketId);
  }
}

export default new TicketService();
