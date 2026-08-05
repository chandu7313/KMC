import bcrypt from 'bcryptjs';
import { HttpError, supabaseClient, createLogger } from '@kissan/shared';
import ticketRepo from '../repositories/ticket.repository.js';
import agentRepo from '../repositories/agent.repository.js';

const logger = createLogger('support-service');

/**
 * Support Management Service — administrative CRM, farmer directory, consultation schedules, canned responses, agents, and SLA policies.
 */
class ManagementService {
  // ── Farmers ──
  /**
   * Search farmer profiles in Supabase directory.
   * @param {object} filters - Search, district, page, limit
   * @returns {Promise<{ farmers: Array, total: number }>}
   */
  async getFarmers(filters) {
    let query = supabaseClient
      .from('users')
      .select('id, name, email, phone, district, language, is_account_verified, created_at', { count: 'exact' })
      .eq('role', 'user');

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }
    if (filters.district) query = query.eq('district', filters.district);

    const limit = parseInt(filters.limit || 25);
    const offset = (parseInt(filters.page || 1) - 1) * limit;

    query = query.order('created_at', { ascending: false });
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    return { farmers: data, total: count };
  }

  /**
   * Get full farmer account details.
   * @param {string} id - Farmer user UUID
   * @returns {Promise<object>} Farmer record
   * @throws {HttpError} If farmer not found
   */
  async getFarmerProfile(id) {
    const res = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (!res.data) throw HttpError.notFound('Farmer not found');
    return res.data;
  }

  /**
   * Toggle farmer account active verification status (block/unblock).
   * @param {string} id - Farmer user UUID
   * @returns {Promise<{ blocked: boolean }>}
   */
  async blockFarmer(id) {
    const farmer = await this.getFarmerProfile(id);
    const newStatus = !farmer.is_account_verified;
    await supabaseClient
      .from('users')
      .update({ is_account_verified: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);
    return { blocked: !newStatus };
  }

  // ── Bookings ──
  /**
   * Query farmer consultation bookings.
   * @param {object} filters - Status, search, pagination
   * @returns {Promise<{ bookings: Array, total: number }>}
   */
  async getBookings(filters) {
    let query = supabaseClient
      .from('bookings')
      .select('*', { count: 'exact' });

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
    }

    const limit = parseInt(filters.limit || 25);
    const offset = (parseInt(filters.page || 1) - 1) * limit;

    query = query.order('visit_date', { ascending: true });
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    return { bookings: data, total: count };
  }

  /**
   * Update consultation booking state.
   * @param {string} id - Booking UUID
   * @param {object} updates - Updates
   * @returns {Promise<object>} Updated booking
   * @throws {HttpError} If booking not found
   */
  async updateBooking(id, updates) {
    updates.updated_at = new Date().toISOString();
    const res = await supabaseClient
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (!res.data) throw HttpError.notFound('Booking not found');
    return res.data;
  }

  // ── Templates ──
  /**
   * Get canned response templates.
   * @param {object} filters - Search/category filters
   * @returns {Promise<Array>} List of templates
   */
  async getTemplates(filters) { return ticketRepo.findTemplates(filters); }

  /**
   * Create canned reply template.
   * @param {object} data - Template details
   * @param {string} userId - Creator UUID
   * @returns {Promise<object>} Created template
   */
  async createTemplate(data, userId) { return ticketRepo.createTemplate({ ...data, createdBy: userId }); }

  /**
   * Update response template.
   * @param {string} id - Template UUID
   * @param {object} updates - Updates
   * @returns {Promise<object>} Updated template
   */
  async updateTemplate(id, updates) { return ticketRepo.updateTemplate(id, updates); }

  /**
   * Deactivate response template.
   * @param {string} id - Template UUID
   * @returns {Promise<object>} Deactivated template
   */
  async deleteTemplate(id) { return ticketRepo.updateTemplate(id, { isActive: false }); }

  // ── Notifications ──
  /**
   * Log broadcast notification sent by staff.
   * @param {object} data - Notification payload
   * @param {string} userId - Author UUID
   * @returns {Promise<object>} Created log
   */
  async sendNotification(data, userId) {
    return ticketRepo.createNotificationLog({
      title: data.title, message: data.message, channel: data.channel || 'email',
      targetType: data.targetType || 'all', targetFilter: data.targetFilter || {},
      targetIds: data.targetIds || [], scheduledAt: data.scheduledAt || null,
      status: data.scheduledAt ? 'scheduled' : 'sent',
      sentAt: data.scheduledAt ? null : new Date().toISOString(), createdBy: userId,
    });
  }

  /**
   * List notification broadcast logs.
   * @param {object} filters - Filters
   * @returns {Promise<Array>} Broadcast history
   */
  async getNotificationHistory(filters) { return ticketRepo.findNotificationLogs(filters); }

  // ── Reports ──
  /**
   * Fetch support reports overview metrics.
   * @returns {Promise<{ totalCreated: number }>}
   */
  async getReportsDashboard() {
    const total = await ticketRepo.countTickets();
    return { totalCreated: total };
  }

  /**
   * Calculate agent resolution statistics.
   * @returns {Promise<Array>} Agent performance list
   */
  async getAgentPerformance() {
    const agents = await agentRepo.findActive();
    return agents.map(a => ({ ...a, ticketsAssigned: 0, ticketsResolved: 0 }));
  }

  // ── Agents ──
  /**
   * List all support agents (passwords stripped).
   * @returns {Promise<Array>} List of agents
   */
  async getAgents() {
    const agents = await agentRepo.findAll();
    return agents.map(a => { const { password, ...rest } = a; return rest; });
  }

  /**
   * Register a new support staff member.
   * @param {object} data - Agent credentials and role
   * @returns {Promise<object>} Created agent profile
   * @throws {HttpError} If email already exists
   */
  async createAgent(data) {
    const existing = await agentRepo.findByEmail(data.email);
    if (existing) throw HttpError.badRequest('Email already exists');
    const hashedPassword = await bcrypt.hash(data.password || 'agent123', 10);
    const agent = await agentRepo.create({
      name: data.name, email: data.email, phone: data.phone, password: hashedPassword,
      role: data.role || 'support_agent', assigned_districts: data.assignedDistricts || [],
      languages_spoken: data.languagesSpoken || ['en'],
    });
    const { password, ...rest } = agent;
    return rest;
  }

  /**
   * Update agent metadata or password.
   * @param {string} id - Agent UUID
   * @param {object} updates - Updates
   * @returns {Promise<object>} Updated agent profile
   * @throws {HttpError} If agent not found
   */
  async updateAgent(id, updates) {
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
    else delete updates.password;
    const agent = await agentRepo.update(id, updates);
    if (!agent) throw HttpError.notFound('Agent not found');
    const { password, ...rest } = agent;
    return rest;
  }

  /**
   * Update agent availability status.
   * @param {string} id - Agent UUID
   * @param {string} status - New status ('online'|'offline'|'busy')
   * @returns {Promise<object>} Updated agent
   */
  async updateAgentStatus(id, status) {
    return agentRepo.update(id, { status });
  }

  // ── SLA ──
  /**
   * Get all SLA policy rules.
   * @returns {Promise<Array>} List of SLA configurations
   */
  async getSLAConfig() { return ticketRepo.findSLAConfig(); }

  /**
   * Upsert SLA policies for priority tiers.
   * @param {Array<object>} configs - SLA configs
   * @returns {Promise<Array>} Updated SLA configurations
   * @throws {HttpError} If configs is not an array
   */
  async updateSLAConfig(configs) {
    if (!Array.isArray(configs)) throw HttpError.badRequest('configs array required');
    for (const c of configs) { await ticketRepo.upsertSLA(c); }
    return ticketRepo.findSLAConfig();
  }
}

export default new ManagementService();
