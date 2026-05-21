import bcrypt from 'bcryptjs';
import { HttpError, models, createLogger } from '@kissan/shared';
import { Op } from 'sequelize';
import ticketRepo from '../repositories/ticket.repository.js';
import agentRepo from '../repositories/agent.repository.js';

const { User, Booking } = models;
const logger = createLogger('support-service');

class ManagementService {
  // ── Farmers ──
  async getFarmers(filters) {
    const where = { role: 'user' };
    
    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { phone: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }
    if (filters.district) where.district = filters.district;

    const limit = parseInt(filters.limit || 25);
    const offset = (parseInt(filters.page || 1) - 1) * limit;

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'phone', 'district', 'language', 'isAccountVerified', 'created_at'],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      raw: true
    });

    return { farmers: rows, total: count };
  }

  async getFarmerProfile(id) {
    const farmer = await User.findByPk(id, { raw: true });
    if (!farmer) throw HttpError.notFound('Farmer not found');
    return farmer;
  }

  async blockFarmer(id) {
    const farmer = await this.getFarmerProfile(id);
    const newStatus = !farmer.isAccountVerified;
    await User.update({ isAccountVerified: newStatus }, { where: { id } });
    return { blocked: !newStatus };
  }

  // ── Bookings ──
  async getBookings(filters) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where[Op.or] = [
        { full_name: { [Op.iLike]: `%${filters.search}%` } },
        { phone: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    const limit = parseInt(filters.limit || 25);
    const offset = (parseInt(filters.page || 1) - 1) * limit;

    const { rows, count } = await Booking.findAndCountAll({
      where,
      order: [['visit_date', 'ASC']],
      limit,
      offset,
      raw: true
    });

    return { bookings: rows, total: count };
  }

  async updateBooking(id, updates) {
    const [_, [updatedBooking]] = await Booking.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    if (!updatedBooking) throw HttpError.notFound('Booking not found');
    return updatedBooking;
  }

  // ── Templates ──
  async getTemplates(filters) { return ticketRepo.findTemplates(filters); }
  async createTemplate(data, userId) { return ticketRepo.createTemplate({ ...data, createdBy: userId }); }
  async updateTemplate(id, updates) { return ticketRepo.updateTemplate(id, updates); }
  async deleteTemplate(id) { return ticketRepo.updateTemplate(id, { isActive: false }); }

  // ── Notifications ──
  async sendNotification(data, userId) {
    return ticketRepo.createNotificationLog({
      title: data.title, message: data.message, channel: data.channel || 'email',
      targetType: data.targetType || 'all', targetFilter: data.targetFilter || {},
      targetIds: data.targetIds || [], scheduledAt: data.scheduledAt || null,
      status: data.scheduledAt ? 'scheduled' : 'sent',
      sentAt: data.scheduledAt ? null : new Date().toISOString(), createdBy: userId,
    });
  }

  async getNotificationHistory(filters) { return ticketRepo.findNotificationLogs(filters); }

  // ── Reports ──
  async getReportsDashboard() {
    const total = await ticketRepo.countTickets();
    return { totalCreated: total };
  }

  async getAgentPerformance() {
    const agents = await agentRepo.findActive();
    return agents.map(a => ({ ...a, ticketsAssigned: 0, ticketsResolved: 0 }));
  }

  // ── Agents ──
  async getAgents() {
    const agents = await agentRepo.findAll();
    return agents.map(a => { const { password, ...rest } = a; return rest; });
  }

  async createAgent(data) {
    const existing = await agentRepo.findByEmail(data.email);
    if (existing) throw HttpError.badRequest('Email already exists');
    const hashedPassword = await bcrypt.hash(data.password || 'agent123', 10);
    const agent = await agentRepo.create({
      name: data.name, email: data.email, phone: data.phone, password: hashedPassword,
      role: data.role || 'support_agent', assignedDistricts: data.assignedDistricts || [],
      languagesSpoken: data.languagesSpoken || ['en'],
    });
    const { password, ...rest } = agent;
    return rest;
  }

  async updateAgent(id, updates) {
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
    else delete updates.password;
    const agent = await agentRepo.update(id, updates);
    if (!agent) throw HttpError.notFound('Agent not found');
    const { password, ...rest } = agent;
    return rest;
  }

  async updateAgentStatus(id, status) {
    return agentRepo.update(id, { status });
  }

  // ── SLA ──
  async getSLAConfig() { return ticketRepo.findSLAConfig(); }
  async updateSLAConfig(configs) {
    if (!Array.isArray(configs)) throw HttpError.badRequest('configs array required');
    for (const c of configs) { await ticketRepo.upsertSLA(c); }
    return ticketRepo.findSLAConfig();
  }
}

export default new ManagementService();
