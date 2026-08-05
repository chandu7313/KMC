import { supabaseClient } from '@kissan/shared';

// Helper to handle Supabase response errors
const handleResponse = (res) => {
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

/**
 * Data access repository for support agents and staff profiles in admin_users.
 */
class AgentRepository {
  /**
   * Find all support agent records.
   * @returns {Promise<Array>} List of agents
   */
  async findAll() {
    const res = await supabaseClient
      .from('admin_users')
      .select('*')
      .order('name', { ascending: true });
    return res.data || [];
  }

  /**
   * Find all currently active agents.
   * @returns {Promise<Array>} Active agent profiles
   */
  async findActive() {
    const res = await supabaseClient
      .from('admin_users')
      .select('id, name, avatar, status, role, email, phone')
      .eq('is_active', true);
    return res.data || [];
  }

  /**
   * Find agent by ID.
   * @param {string} id - Agent UUID
   * @returns {Promise<object|null>} Agent record or null
   */
  async findById(id) {
    const res = await supabaseClient
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();
    return res.data; // null if not found
  }

  /**
   * Find agent by email address.
   * @param {string} email - Email address
   * @returns {Promise<object|null>} Agent record or null
   */
  async findByEmail(email) {
    const res = await supabaseClient
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();
    return res.data; // null if not found
  }

  /**
   * Insert new agent record into database.
   * @param {object} data - Agent credentials and permissions
   * @returns {Promise<object>} Created agent record
   */
  async create(data) {
    const res = await supabaseClient
      .from('admin_users')
      .insert(data)
      .select()
      .single();
    return handleResponse(res);
  }

  /**
   * Update agent record by ID.
   * @param {string} id - Agent UUID
   * @param {object} updates - Updates
   * @returns {Promise<object|null>} Updated agent
   */
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
