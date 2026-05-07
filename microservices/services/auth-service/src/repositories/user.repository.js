import { getSupabaseClient } from '@kissan/shared';

/**
 * User repository — abstracts all Supabase queries for the users table.
 * Single source of truth for auth-related DB operations.
 */
class UserRepository {
  constructor() {
    this.db = getSupabaseClient();
    this.table = 'users';
    this.adminTable = 'admin_users';
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

  async findByPhone(phone) {
    const { data, error } = await this.db
      .from(this.table)
      .select('*')
      .eq('phone', phone)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async create(userData) {
    const { data, error } = await this.db
      .from(this.table)
      .insert(userData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await this.db
      .from(this.table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // ── Admin User queries ──

  async findAdminByEmail(email) {
    const { data, error } = await this.db
      .from(this.adminTable)
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createAdmin(adminData) {
    const { data, error } = await this.db
      .from(this.adminTable)
      .insert(adminData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export default new UserRepository();
