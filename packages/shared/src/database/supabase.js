const { createClient } = require('@supabase/supabase-js');
const { logger } = require('../logger/winston');
const config = require('../../config/src/env');

/**
 * Supabase client wrapper providing a singleton instance,
 * health checks, retry logic, and debug logging.
 */
class SupabaseService {
  constructor() {
    this.url = config.supabase.url;
    this.serviceKey = config.supabase.serviceKey;
    
    if (!this.url || !this.serviceKey) {
      logger.error('Supabase URL or Service Key is missing in configuration.');
    }

    // Create the Supabase client using the service role key to bypass RLS in microservices
    this.client = createClient(this.url, this.serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    this.isDebugMode = config.app.nodeEnv === 'development';
  }

  /**
   * Health check to ensure Supabase connection is active.
   * Performs a lightweight query to verify connectivity.
   * 
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      // Execute a simple query that shouldn't impact performance
      const { error } = await this.client.from('pg_stat_activity').select('pid').limit(1);
      
      // If error is about the table not existing, it still means we reached the DB
      // We return true unless there's a network/connection-level error.
      if (error && error.code === 'PGRST301') {
         logger.warn('Supabase health check: pg_stat_activity not accessible via REST API, but DB is reachable.');
         return true;
      } else if (error) {
         throw error;
      }
      return true;
    } catch (error) {
      logger.error(`Supabase health check failed: ${error.message}`, { error });
      return false;
    }
  }

  /**
   * Helper function to execute Supabase operations with automatic retry and logging.
   * 
   * @param {string} operationName - Descriptive name for logging (e.g., 'getUser')
   * @param {Function} queryFn - Async function executing the query
   * @param {number} retries - Number of retry attempts (default: 3)
   * @returns {Promise<any>}
   */
  async execute(operationName, queryFn, retries = 3) {
    let attempt = 0;
    
    while (attempt < retries) {
      try {
        const startTime = Date.now();
        const result = await queryFn(this.client);
        const duration = Date.now() - startTime;

        if (this.isDebugMode) {
          logger.debug(`[Supabase] ${operationName} executed in ${duration}ms`);
        }

        if (result.error) {
           throw result.error;
        }

        return result.data;
      } catch (error) {
        attempt++;
        logger.warn(`[Supabase] ${operationName} failed (Attempt ${attempt}/${retries}): ${error.message}`);
        
        if (attempt >= retries) {
          logger.error(`[Supabase] ${operationName} permanently failed after ${retries} attempts.`, { error });
          throw error;
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 100;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Get the native Supabase client instance.
   * Use this for complex queries not covered by the `execute` wrapper.
   * 
   * @returns {import('@supabase/supabase-js').SupabaseClient}
   */
  getClient() {
    return this.client;
  }
}

// Export a singleton instance
const supabaseService = new SupabaseService();

module.exports = supabaseService;
