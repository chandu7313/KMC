import { getSupabaseClient } from '@kissan/shared';

/**
 * Address repository — Supabase queries for user_addresses table.
 */
class AddressRepository {
  constructor() {
    this.db = getSupabaseClient();
    this.table = 'user_addresses';
  }

  async findByUserId(userId) {
    const { data, error } = await this.db
      .from(this.table)
      .select('*')
      .eq('userId', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
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

  async create(addressData) {
    const { data, error } = await this.db
      .from(this.table)
      .insert(addressData)
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

  async delete(id) {
    const { error } = await this.db.from(this.table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

export default new AddressRepository();
