import { getSupabaseClient } from '@kissan/shared';

class BookingRepository {
  constructor() { this.db = getSupabaseClient(); this.table = 'bookings'; }

  async create(data) {
    const { data: booking, error } = await this.db.from(this.table).insert(data).select().single();
    if (error) throw error;
    return booking;
  }

  async findById(id) {
    const { data, error } = await this.db.from(this.table).select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findByFarmer(farmerId) {
    const { data, error } = await this.db.from(this.table).select('*').eq('farmerId', farmerId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findAll(filters = {}) {
    let q = this.db.from(this.table).select('*', { count: 'exact' });
    if (filters.status) q = q.eq('status', filters.status);
    if (filters.district) q = q.eq('district', filters.district);
    q = q.order('visitDate', { ascending: true });
    if (filters.page) {
      const offset = (parseInt(filters.page) - 1) * parseInt(filters.limit || 25);
      q = q.range(offset, offset + parseInt(filters.limit || 25) - 1);
    }
    const { data, count, error } = await q;
    if (error) throw error;
    return { bookings: data || [], total: count || 0 };
  }

  async update(id, updates) {
    const { data, error } = await this.db.from(this.table).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await this.db.from(this.table).delete().eq('id', id);
    if (error) throw error;
  }
}

export default new BookingRepository();
