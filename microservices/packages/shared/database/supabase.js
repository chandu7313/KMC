import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

let supabaseClient = null;

/**
 * Get or create a Supabase client singleton.
 * Uses service role key for backend operations (bypasses RLS).
 * @param {object} [options] - Override URL/key
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
const getSupabaseClient = (options = {}) => {
  if (supabaseClient) return supabaseClient;

  const url = options.url || process.env.SUPABASE_URL;
  const key = options.key || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  }

  supabaseClient = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
    realtime: {
      transport: ws,
    },
  });

  return supabaseClient;
};

/**
 * Health check for Supabase connection.
 * @returns {Promise<{connected: boolean, latency: number}>}
 */
const checkSupabaseHealth = async () => {
  const start = Date.now();
  try {
    const client = getSupabaseClient();
    const { error } = await client.from('_health_check').select('*').limit(1).maybeSingle();
    // Table may not exist — that's fine, connection still works
    const latency = Date.now() - start;
    return { connected: !error || error.code === 'PGRST116', latency };
  } catch (err) {
    return { connected: false, latency: Date.now() - start, error: err.message };
  }
};

export { getSupabaseClient, checkSupabaseHealth };
