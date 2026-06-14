import { createClient } from '@supabase/supabase-js';
import createLogger from '../logger/winston.js';
import WebSocket from 'ws';

// Polyfill WebSocket for Node.js 18
global.WebSocket = WebSocket;

const logger = createLogger('supabase');

// Note: Ensure SUPABASE_REST_URL and SUPABASE_SERVICE_ROLE_KEY are in your backend .env
const supabaseUrl = process.env.SUPABASE_REST_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabaseClient = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    });
    logger.info('Supabase JS Client initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Supabase JS Client:', error);
  }
} else {
  logger.warn('Supabase REST URL or Key is missing or invalid. Supabase JS client not initialized.');
}

export { supabaseClient };
