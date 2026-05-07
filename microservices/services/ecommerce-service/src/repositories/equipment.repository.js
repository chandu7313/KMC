import { getSupabaseClient } from '@kissan/shared';

class EquipmentRepository {
  constructor() { this.db = getSupabaseClient(); this.table = 'equipments'; }

  async findAll(filters = {}) {
    let q = this.db.from(this.table).select('*');
    if (filters.category) q = q.eq('category', filters.category);
    if (filters.search) q = q.ilike('name', `%${filters.search}%`);
    q = q.order('created_at', { ascending: false });
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await this.db.from(this.table).select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async create(equipment) {
    const { data, error } = await this.db.from(this.table).insert(equipment).select().single();
    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await this.db.from(this.table).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await this.db.from(this.table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

export default new EquipmentRepository();
