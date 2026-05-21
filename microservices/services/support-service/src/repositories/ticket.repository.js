import { models } from '@kissan/shared';
import { Op } from 'sequelize';

const { SupportTicket, TicketMessage, ReplyTemplate, NotificationLog, SLAConfig } = models;

class TicketRepository {
  // ── Tickets ──
  async createTicket(data) {
    const ticket = await SupportTicket.create(data);
    return ticket.get({ plain: true });
  }

  async findTicketById(id) {
    return SupportTicket.findByPk(id, { raw: true });
  }

  async findTickets({ page = 1, limit = 25, status, priority, category, assignedTo, search } = {}) {
    const where = {};
    if (status && status !== 'all') where.status = status;
    if (priority && priority !== 'all') where.priority = priority;
    if (category) where.category = category;
    if (assignedTo) where.assignedTo = assignedTo;
    
    if (search) {
      where[Op.or] = [
        { ticketRef: { [Op.iLike]: `%${search}%` } },
        { subject: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await SupportTicket.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
      raw: true
    });

    return { tickets: rows, total: count };
  }

  async updateTicket(id, updates) {
    const [_, [updatedTicket]] = await SupportTicket.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedTicket;
  }

  async deleteTicket(id) {
    await SupportTicket.destroy({ where: { id } });
  }

  async countTickets(where = {}) {
    return SupportTicket.count({ where });
  }

  // ── Messages ──
  async createMessage(data) {
    const msg = await TicketMessage.create(data);
    return msg.get({ plain: true });
  }

  async findMessages(ticketId) {
    return TicketMessage.findAll({
      where: { ticketId },
      order: [['created_at', 'ASC']],
      raw: true
    });
  }

  // ── Templates ──
  async findTemplates(filters = {}) {
    const where = { isActive: true };
    if (filters.category) where.category = filters.category;

    return ReplyTemplate.findAll({
      where,
      order: [['category', 'ASC'], ['name', 'ASC']],
      raw: true
    });
  }

  async createTemplate(data) {
    const template = await ReplyTemplate.create(data);
    return template.get({ plain: true });
  }

  async updateTemplate(id, updates) {
    const [_, [updatedTemplate]] = await ReplyTemplate.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedTemplate;
  }

  // ── Notification Logs ──
  async createNotificationLog(data) {
    const log = await NotificationLog.create(data);
    return log.get({ plain: true });
  }

  async findNotificationLogs({ page = 1, limit = 25 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await NotificationLog.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit,
      offset,
      raw: true
    });

    return { logs: rows, total: count };
  }

  // ── SLA Config ──
  async findSLAConfig() {
    return SLAConfig.findAll({
      order: [['firstResponseMins', 'ASC']],
      raw: true
    });
  }

  async upsertSLA(config) {
    const [record] = await SLAConfig.upsert(config, { returning: true });
    return record.get({ plain: true });
  }

  async findSLAByPriority(priority) {
    return SLAConfig.findOne({ where: { priority }, raw: true });
  }
}

export default new TicketRepository();
