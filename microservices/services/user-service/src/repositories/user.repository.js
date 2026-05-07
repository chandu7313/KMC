import { getSupabaseClient } from '@kissan/shared';

/**
 * User repository — Supabase queries for users table.
 */
class UserRepository {
  constructor() {
    this.db = getSupabaseClient();
    this.table = 'users';
  }

  async findById(id, fields = '*') {
    const { data, error } = await this.db
      .from(this.table)
      .select(fields)
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findByEmail(email) {
    const { data, error } = await this.db
      .from(this.table)
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findByPhone(phone) {
    const { data, error } = await this.db
      .from(this.table)
      .select('*')
      .eq('phone', phone)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await this.db
      .from(this.table)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await this.db
      .from(this.table)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }

  /**
   * List users with pagination, filters, and search.
   */
  async findAll({ page = 1, limit = 20, role, search, district, isVerified } = {}) {
    let query = this.db
      .from(this.table)
      .select('id, name, email, phone, role, district, crops, isAccountVerified, created_at', { count: 'exact' });

    if (role) query = query.eq('role', role);
    if (district) query = query.eq('district', district);
    if (isVerified !== undefined) query = query.eq('isAccountVerified', isVerified);
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      users: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Get distinct districts for filter dropdowns.
   */
  async getDistinctDistricts() {
    const { data, error } = await this.db
      .from(this.table)
      .select('district')
      .eq('role', 'user')
      .not('district', 'is', null);
    if (error) throw error;
    const unique = [...new Set((data || []).map(d => d.district).filter(Boolean))];
    return unique.sort();
  }

  /**
   * Count users by role.
   */
  async countByRole(role) {
    const { count, error } = await this.db
      .from(this.table)
      .select('*', { count: 'exact', head: true })
      .eq('role', role);
    if (error) throw error;
    return count || 0;
  }
}

export default new UserRepository();
