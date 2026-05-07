import { getSupabaseClient } from '@kissan/shared';

class AgentRepository {
  constructor() { this.db = getSupabaseClient(); this.table = 'admin_users'; }

  async findAll() {
    const { data, error } = await this.db.from(this.table).select('*').order('name');
    if (error) throw error;
    return data || [];
  }

  async findActive() {
    const { data, error } = await this.db.from(this.table).select('id,name,avatar,status,role,email,phone').eq('isActive', true);
    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await this.db.from(this.table).select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findByEmail(email) {
    const { data, error } = await this.db.from(this.table).select('*').eq('email', email).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async create(data) {
    const { data: agent, error } = await this.db.from(this.table).insert(data).select().single();
    if (error) throw error;
    return agent;
  }

  async update(id, updates) {
    const { data, error } = await this.db.from(this.table).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
}

export default new AgentRepository();
