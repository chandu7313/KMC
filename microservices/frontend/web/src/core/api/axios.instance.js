/**
 * Centralized Axios Instance
 * All API calls should use this instance instead of importing axios directly.
 * - withCredentials is set globally (cookie-based auth)
 * - Base URL is configured from environment
 * - Auth and Error interceptors are attached
 */
import axios from 'axios';
import env from '../../app/config/env';
import { setupAuthInterceptor } from './interceptors/auth.interceptor';
import { setupErrorInterceptor } from './interceptors/error.interceptor';

const api = axios.create({
  baseURL: env.BACKEND_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach interceptors
setupAuthInterceptor(api);
setupErrorInterceptor(api);

export default api;
