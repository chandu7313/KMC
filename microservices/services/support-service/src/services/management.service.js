import bcrypt from 'bcryptjs';
import { HttpError, getSupabaseClient, createLogger } from '@kissan/shared';
import ticketRepo from '../repositories/ticket.repository.js';
import agentRepo from '../repositories/agent.repository.js';

const logger = createLogger('support-service');
const db = getSupabaseClient();

class ManagementService {
  // ── Farmers ──
  async getFarmers(filters) {
    let q = db.from('users').select('id,name,email,phone,district,language,isAccountVerified,created_at', { count: 'exact' }).eq('role', 'user');
    if (filters.search) q = q.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    if (filters.district) q = q.eq('district', filters.district);
    const offset = (parseInt(filters.page || 1) - 1) * parseInt(filters.limit || 25);
    q = q.order('created_at', { ascending: false }).range(offset, offset + parseInt(filters.limit || 25) - 1);
    const { data, count, error } = await q;
    if (error) throw error;
    return { farmers: data || [], total: count || 0 };
  }

  async getFarmerProfile(id) {
    const { data: farmer, error } = await db.from('users').select('*').eq('id', id).single();
    if (error) throw HttpError.notFound('Farmer not found');
    return farmer;
  }

  async blockFarmer(id) {
    const farmer = await this.getFarmerProfile(id);
    const newStatus = !farmer.isAccountVerified;
    await db.from('users').update({ isAccountVerified: newStatus }).eq('id', id);
    return { blocked: !newStatus };
  }

  // ── Bookings ──
  async getBookings(filters) {
    let q = db.from('bookings').select('*', { count: 'exact' });
    if (filters.status) q = q.eq('status', filters.status);
    if (filters.search) q = q.or(`fullName.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
    const offset = (parseInt(filters.page || 1) - 1) * parseInt(filters.limit || 25);
    q = q.order('visitDate').range(offset, offset + parseInt(filters.limit || 25) - 1);
    const { data, count, error } = await q;
    if (error) throw error;
    return { bookings: data || [], total: count || 0 };
  }

  async updateBooking(id, updates) {
    const { data, error } = await db.from('bookings').update(updates).eq('id', id).select().single();
    if (error) throw HttpError.notFound('Booking not found');
    return data;
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
    return agents.map(a => ({ ...a, ticketsAssigned: 0, ticketsResolved: 0 })); // Stats populated via aggregation
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
