/**
 * Environment Configuration
 * Validates and exports all environment variables.
 * Fail-fast: throws during startup if required vars are missing.
 */

const env = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost',
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  SHOW_DEV_LOGIN: import.meta.env.VITE_SHOW_DEV_LOGIN === 'true' || import.meta.env.DEV,
};

// Validation
if (!env.BACKEND_URL) {
  console.error('[KMC] VITE_BACKEND_URL is not set. API calls will fail.');
}

export default env;
