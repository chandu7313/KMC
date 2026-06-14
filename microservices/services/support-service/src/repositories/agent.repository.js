import { supabaseClient } from '@kissan/shared';

// Helper to handle Supabase response errors
const handleResponse = (res) => {
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

class AgentRepository {
  async findAll() {
    const res = await supabaseClient
      .from('admin_users')
      .select('*')
      .order('name', { ascending: true });
    return res.data || [];
  }

  async findActive() {
    const res = await supabaseClient
      .from('admin_users')
      .select('id, name, avatar, status, role, email, phone')
      .eq('is_active', true);
    return res.data || [];
  }

  async findById(id) {
    const res = await supabaseClient
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();
    return res.data; // null if not found
  }

  async findByEmail(email) {
    const res = await supabaseClient
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();
    return res.data; // null if not found
  }

  async create(data) {
    const res = await supabaseClient
      .from('admin_users')
      .insert(data)
      .select()
      .single();
    return handleResponse(res);
  }

  async update(id, updates) {
    updates.updated_at = new Date().toISOString();
    const res = await supabaseClient
      .from('admin_users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return res.data;
  }
}

export default new AgentRepository();
