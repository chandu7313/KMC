/**
 * Auth API Layer
 * All authentication-related API calls extracted from Login.jsx and AppContext.
 * Uses the centralized Axios instance.
 */
import api from '@/shared/services/http/axios.client';
import API from '@/core/api/api.config';

/**
 * Check if the user is currently authenticated
 */
export const checkAuthState = async () => {
  const data = await api.get(`${API.AUTH}/is-auth`);
  return data;
};

/**
 * Send OTP to a phone number
 */
export const sendOtp = async (phone) => {
  const data = await api.post(`${API.AUTH}/send-otp`, { phone });
  return data;
};

/**
 * Verify OTP and authenticate
 */
export const verifyOtp = async (phone, otp) => {
  const data = await api.post(`${API.AUTH}/verify-otp`, { phone, otp });
  return data;
};

/**
 * Register a new user via email
 */
export const register = async (name, email, password) => {
  const data = await api.post(`${API.AUTH}/register`, { name, email, password });
  return data;
};

/**
 * Login via email and password
 */
export const login = async (email, password) => {
  const data = await api.post(`${API.AUTH}/login`, { email, password });
  return data;
};

/**
 * Dev auto-login by role
 */
export const autoLogin = async (role) => {
  const data = await api.post(`${API.AUTH}/auto-login`, { role });
  return data;
};

/**
 * Logout the current user
 */
export const logout = async () => {
  const data = await api.post(`${API.AUTH}/logout`);
  return data;
};

/**
 * Get current user data
 */
export const getUserData = async () => {
  const data = await api.get(`${API.USER}/profile/data`, {
    timeout: 10000,
    _retry: false
  });
  return data;
};

/**
 * Check onboarding survey status
 */
export const checkSurveyStatus = async () => {
  const data = await api.get(`${API.SURVEY}/status`);
  return data;
};

/**
 * Sync user preferences to backend after login
 */
export const syncPreferences = async (preferences) => {
  const data = await api.post(`${API.USER}/profile/preferences`, preferences);
  return data;
};

/**
 * Update user language preference
 */
export const updateLanguage = async (language) => {
  const data = await api.post(`${API.USER}/profile/language`, { language });
  return data;
};
