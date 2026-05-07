import { getSupabaseClient } from '@kissan/shared';

class TicketRepository {
  constructor() { this.db = getSupabaseClient(); }

  // ── Tickets ──
  async createTicket(data) {
    const { data: ticket, error } = await this.db.from('support_tickets').insert(data).select().single();
    if (error) throw error;
    return ticket;
  }

  async findTicketById(id) {
    const { data, error } = await this.db.from('support_tickets').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findTickets({ page = 1, limit = 25, status, priority, category, assignedTo, search } = {}) {
    let q = this.db.from('support_tickets').select('*', { count: 'exact' });
    if (status && status !== 'all') q = q.eq('status', status);
    if (priority && priority !== 'all') q = q.eq('priority', priority);
    if (category) q = q.eq('category', category);
    if (assignedTo) q = q.eq('assignedTo', assignedTo);
    if (search) q = q.or(`ticketRef.ilike.%${search}%,subject.ilike.%${search}%`);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    q = q.order('created_at', { ascending: false }).range(offset, offset + parseInt(limit) - 1);
    const { data, count, error } = await q;
    if (error) throw error;
    return { tickets: data || [], total: count || 0 };
  }

  async updateTicket(id, updates) {
    const { data, error } = await this.db.from('support_tickets').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteTicket(id) {
    const { error } = await this.db.from('support_tickets').delete().eq('id', id);
    if (error) throw error;
  }

  async countTickets(where = {}) {
    let q = this.db.from('support_tickets').select('*', { count: 'exact', head: true });
    Object.entries(where).forEach(([key, val]) => { q = q.eq(key, val); });
    const { count, error } = await q;
    if (error) throw error;
    return count || 0;
  }

  // ── Messages ──
  async createMessage(data) {
    const { data: msg, error } = await this.db.from('ticket_messages').insert(data).select().single();
    if (error) throw error;
    return msg;
  }

  async findMessages(ticketId) {
    const { data, error } = await this.db.from('ticket_messages').select('*').eq('ticketId', ticketId).order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  // ── Templates ──
  async findTemplates(filters = {}) {
    let q = this.db.from('reply_templates').select('*').eq('isActive', true);
    if (filters.category) q = q.eq('category', filters.category);
    q = q.order('category').order('name');
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }

  async createTemplate(data) {
    const { data: t, error } = await this.db.from('reply_templates').insert(data).select().single();
    if (error) throw error;
    return t;
  }

  async updateTemplate(id, updates) {
    const { data, error } = await this.db.from('reply_templates').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  // ── Notification Logs ──
  async createNotificationLog(data) {
    const { data: log, error } = await this.db.from('notification_logs').insert(data).select().single();
    if (error) throw error;
    return log;
  }

  async findNotificationLogs({ page = 1, limit = 25 } = {}) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { data, count, error } = await this.db.from('notification_logs').select('*', { count: 'exact' })
      .order('created_at', { ascending: false }).range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;
    return { logs: data || [], total: count || 0 };
  }

  // ── SLA Config ──
  async findSLAConfig() {
    const { data, error } = await this.db.from('sla_config').select('*').order('firstResponseMins');
    if (error) throw error;
    return data || [];
  }

  async upsertSLA(config) {
    const { data, error } = await this.db.from('sla_config').upsert(config, { onConflict: 'priority' }).select().single();
    if (error) throw error;
    return data;
  }

  async findSLAByPriority(priority) {
    const { data, error } = await this.db.from('sla_config').select('*').eq('priority', priority).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}

export default new TicketRepository();
