import { getSupabaseClient } from '@kissan/shared';

class PaymentRepository {
  constructor() { this.db = getSupabaseClient(); this.table = 'payments'; }

  async create(data) {
    const { data: record, error } = await this.db.from(this.table).insert(data).select().single();
    if (error) throw error;
    return record;
  }

  async findById(id) {
    const { data, error } = await this.db.from(this.table).select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findByOrder(orderId) {
    const { data, error } = await this.db.from(this.table).select('*').eq('orderId', orderId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findByUser(userId) {
    const { data, error } = await this.db.from(this.table).select('*').eq('userId', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async update(id, updates) {
    const { data, error } = await this.db.from(this.table).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
}

export default new PaymentRepository();
