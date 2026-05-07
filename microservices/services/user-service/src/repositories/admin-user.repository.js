import { getSupabaseClient } from '@kissan/shared';

/**
 * Admin user repository — Supabase queries for admin_users table.
 */
class AdminUserRepository {
  constructor() {
    this.db = getSupabaseClient();
    this.table = 'admin_users';
  }

  async findById(id) {
    const { data, error } = await this.db
      .from(this.table)
      .select('*')
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

  async create(adminData) {
    const { data, error } = await this.db
      .from(this.table)
      .insert(adminData)
      .select()
      .single();
    if (error) throw error;
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
    const { error } = await this.db.from(this.table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  async findAll({ page = 1, limit = 20, role, status } = {}) {
    let query = this.db
      .from(this.table)
      .select('id, name, email, role, status, created_at', { count: 'exact' });

    if (role) query = query.eq('role', role);
    if (status) query = query.eq('status', status);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      admins: data || [],
      pagination: {
        page, limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }
}

export default new AdminUserRepository();
