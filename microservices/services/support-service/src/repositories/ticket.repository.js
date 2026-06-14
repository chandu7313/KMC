import { supabaseClient } from '@kissan/shared';

// Helper to handle Supabase response errors
const handleResponse = (res) => {
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

class TicketRepository {
  // ── Tickets ──
  async createTicket(data) {
    const res = await supabaseClient
      .from('support_tickets')
      .insert(data)
      .select()
      .single();
    return handleResponse(res);
  }

  async findTicketById(id) {
    const res = await supabaseClient
      .from('support_tickets')
      .select('*')
      .eq('id', id)
      .single();
    return res.data; // Return null if not found
  }

  async findTickets({ page = 1, limit = 25, status, priority, category, assignedTo, search, dateFrom, dateTo, sortBy = 'created_at', sortOrder = 'desc' } = {}) {
    let query = supabaseClient
      .from('support_tickets')
      .select('*', { count: 'exact' });

    if (status && status !== 'all') query = query.eq('status', status);
    if (priority && priority !== 'all') query = query.eq('priority', priority);
    if (category) query = query.eq('category', category);
    if (assignedTo) query = query.eq('assigned_to', assignedTo);
    
    if (search) {
      query = query.or(`ticket_ref.ilike.%${search}%,subject.ilike.%${search}%,farmer_name.ilike.%${search}%`);
    }

    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo) query = query.lte('created_at', dateTo);

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.order(sortBy, { ascending: sortOrder.toLowerCase() === 'asc' });
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    return { tickets: data, total: count, page: parseInt(page), limit: parseInt(limit) };
  }

  async updateTicket(id, updates) {
    updates.updated_at = new Date().toISOString();
    const res = await supabaseClient
      .from('support_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return res.data;
  }

  async deleteTicket(id) {
    const res = await supabaseClient
      .from('support_tickets')
      .delete()
      .eq('id', id);
    handleResponse(res);
  }

  async countTickets(filters = {}) {
    let query = supabaseClient.from('support_tickets').select('*', { count: 'exact', head: true });
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });
    const res = await query;
    return res.count || 0;
  }

  // ── Aggregations (using Postgres RPC functions) ──
  async countByStatus() {
    const res = await supabaseClient.rpc('get_ticket_count_by_status');
    const counts = {};
    if (res.data) {
      res.data.forEach(r => { counts[r.status] = r.count; });
    }
    return counts;
  }

  async countByCategory() {
    const res = await supabaseClient.rpc('get_ticket_count_by_category');
    return res.data ? res.data.map(r => ({ name: r.category, value: r.count })) : [];
  }

  async countResolvedSince(since) {
    const res = await supabaseClient
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'resolved')
      .gte('resolved_at', since);
    return res.count || 0;
  }

  async countCreatedSince(since) {
    const res = await supabaseClient
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since);
    return res.count || 0;
  }

  async findCriticalTickets(limit = 10) {
    const res = await supabaseClient
      .from('support_tickets')
      .select('*')
      .in('priority', ['critical', 'high'])
      .not('status', 'in', '("resolved","closed")')
      .order('created_at', { ascending: false })
      .limit(limit);
    return res.data || [];
  }

  async findSLABreaching(minutesAhead = 120) {
    const now = new Date();
    const cutoff = new Date(now.getTime() + minutesAhead * 60 * 1000).toISOString();
    const res = await supabaseClient
      .from('support_tickets')
      .select('*')
      .not('status', 'in', '("resolved","closed")')
      .gt('sla_due_at', now.toISOString())
      .lte('sla_due_at', cutoff)
      .order('sla_due_at', { ascending: true })
      .limit(10);
    return res.data || [];
  }

  async findBreachedNotMarked() {
    const now = new Date().toISOString();
    const res = await supabaseClient
      .from('support_tickets')
      .select('*')
      .eq('sla_breached', false)
      .lt('sla_due_at', now)
      .not('status', 'in', '("resolved","closed")');
    return res.data || [];
  }

  async getTicketVolumeByDay(days = 7) {
    const res = await supabaseClient.rpc('get_ticket_volume_by_day', { days_limit: days });
    return res.data || [];
  }

  async getNextTicketRef() {
    const res = await supabaseClient
      .from('support_tickets')
      .select('ticket_ref')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (!res.data || !res.data.ticket_ref) return 'TK-1001';
    const num = parseInt(res.data.ticket_ref.replace('TK-', '')) + 1;
    return `TK-${num}`;
  }

  // ── Messages ──
  async createMessage(data) {
    const res = await supabaseClient
      .from('ticket_messages')
      .insert(data)
      .select()
      .single();
    return handleResponse(res);
  }

  async findMessages(ticketId) {
    const res = await supabaseClient
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    return res.data || [];
  }

  // ── Activity ──
  async createActivity(data) {
    const res = await supabaseClient
      .from('ticket_activity')
      .insert(data)
      .select()
      .single();
    return handleResponse(res);
  }

  async findActivity(ticketId) {
    const res = await supabaseClient
      .from('ticket_activity')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });
    return res.data || [];
  }

  async findRecentActivity(limit = 20) {
    const res = await supabaseClient
      .from('ticket_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    return res.data || [];
  }

  // ── Templates ──
  async findTemplates(filters = {}) {
    let query = supabaseClient.from('reply_templates').select('*').eq('is_active', true);
    if (filters.category) query = query.eq('category', filters.category);
    query = query.order('category').order('name');
    const res = await query;
    return res.data || [];
  }

  async findTemplateById(id) {
    const res = await supabaseClient.from('reply_templates').select('*').eq('id', id).single();
    return res.data;
  }

  async createTemplate(data) {
    const res = await supabaseClient.from('reply_templates').insert(data).select().single();
    return handleResponse(res);
  }

  async updateTemplate(id, updates) {
    const res = await supabaseClient.from('reply_templates').update(updates).eq('id', id).select().single();
    return res.data;
  }

  async incrementTemplateUsage(id) {
    await supabaseClient.rpc('increment_template_usage', { template_id: id });
  }

  // ── Notification Logs ──
  async createNotificationLog(data) {
    const res = await supabaseClient.from('notification_logs').insert(data).select().single();
    return handleResponse(res);
  }

  async findNotificationLogs({ page = 1, limit = 25 } = {}) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const res = await supabaseClient
      .from('notification_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);
    
    if (res.error) throw new Error(res.error.message);
    return { logs: res.data, total: res.count };
  }

  // ── SLA Config ──
  async findSLAConfig() {
    const res = await supabaseClient
      .from('sla_config')
      .select('*')
      .eq('is_active', true)
      .order('first_response_hours', { ascending: true });
    return res.data || [];
  }

  async findSLAByPriority(priority) {
    const res = await supabaseClient
      .from('sla_config')
      .select('*')
      .eq('priority', priority)
      .single();
    return res.data;
  }

  async upsertSLA(config) {
    const res = await supabaseClient
      .from('sla_config')
      .upsert(config, { onConflict: 'priority' })
      .select()
      .single();
    return handleResponse(res);
  }

  // ── Agent Performance ──
  async findAgentPerformance(filters = {}) {
    let query = supabaseClient.from('agent_performance').select('*');
    if (filters.agentId) query = query.eq('agent_id', filters.agentId);
    if (filters.dateFrom) query = query.gte('date', filters.dateFrom);
    if (filters.dateTo) query = query.lte('date', filters.dateTo);
    
    query = query.order('date', { ascending: false });
    const res = await query;
    return res.data || [];
  }

  async getAvgResponseMins(days = 7) {
    const res = await supabaseClient.rpc('get_avg_response_mins', { days_limit: days });
    return res.data || 0;
  }

  async getAvgCSAT(days = 30) {
    const res = await supabaseClient.rpc('get_avg_csat', { days_limit: days });
    return res.data || 0;
  }
}

export default new TicketRepository();
