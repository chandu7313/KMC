import { getSupabaseClient } from '@kissan/shared';

class ExpertRepository {
  constructor() { this.db = getSupabaseClient(); }

  // ── Experts ──
  async findAll({ page = 1, limit = 20, specialization, available } = {}) {
    let q = this.db.from('experts').select('*', { count: 'exact' }).eq('isActive', true);
    if (specialization) q = q.eq('specialization', specialization);
    if (available !== undefined) q = q.eq('isAvailable', available);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    q = q.order('rating', { ascending: false }).range(offset, offset + parseInt(limit) - 1);
    const { data, count, error } = await q;
    if (error) throw error;
    return { experts: data || [], total: count || 0 };
  }

  async findById(id) {
    const { data, error } = await this.db.from('experts').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findByUserId(userId) {
    const { data, error } = await this.db.from('experts').select('*').eq('userId', userId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async create(data) {
    const { data: expert, error } = await this.db.from('experts').insert(data).select().single();
    if (error) throw error;
    return expert;
  }

  async update(id, updates) {
    const { data, error } = await this.db.from('experts').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await this.db.from('experts').update({ isActive: false }).eq('id', id);
    if (error) throw error;
  }

  // ── Bookings ──
  async createBooking(data) {
    const { data: booking, error } = await this.db.from('expert_bookings').insert(data).select().single();
    if (error) throw error;
    return booking;
  }

  async findBookingById(id) {
    const { data, error } = await this.db.from('expert_bookings').select('*, experts(*)').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findBookingsByFarmer(farmerId, { page = 1, limit = 10 } = {}) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { data, count, error } = await this.db
      .from('expert_bookings')
      .select('*, experts(name, specialization, profileImage)', { count: 'exact' })
      .eq('farmerId', farmerId)
      .order('scheduledAt', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;
    return { bookings: data || [], total: count || 0 };
  }

  async findBookingsByExpert(expertId, { page = 1, limit = 10 } = {}) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { data, count, error } = await this.db
      .from('expert_bookings')
      .select('*', { count: 'exact' })
      .eq('expertId', expertId)
      .order('scheduledAt', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;
    return { bookings: data || [], total: count || 0 };
  }

  async updateBooking(id, updates) {
    const { data, error } = await this.db.from('expert_bookings').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async countBookings(where = {}) {
    let q = this.db.from('expert_bookings').select('*', { count: 'exact', head: true });
    Object.entries(where).forEach(([key, val]) => { q = q.eq(key, val); });
    const { count, error } = await q;
    if (error) throw error;
    return count || 0;
  }

  // ── Reviews ──
  async createReview(data) {
    const { data: review, error } = await this.db.from('expert_reviews').insert(data).select().single();
    if (error) throw error;
    return review;
  }

  async findReviewsByExpert(expertId) {
    const { data, error } = await this.db.from('expert_reviews').select('*').eq('expertId', expertId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getAverageRating(expertId) {
    const { data, error } = await this.db.from('expert_reviews').select('rating').eq('expertId', expertId);
    if (error) throw error;
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  }
}

export default new ExpertRepository();
