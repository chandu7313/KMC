/**
 * Application Constants
 * Centralized place for magic numbers and strings used across the app.
 */

// Shipping
export const FREE_SHIPPING_THRESHOLD = 5000;
export const STANDARD_SHIPPING_COST = 500;

// Auth
export const OTP_LENGTH = 6;
export const BCRYPT_ROUNDS = 12;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;

// LocalStorage keys
export const STORAGE_KEYS = {
  LANGUAGE: 'i18nextLng',
  LANGUAGE_SET: 'languageSet',
  TOUR_COMPLETED: 'tourCompleted',
  KMC_TOUR_COMPLETED: 'kmc_tour_completed',
  FARMER_MODE: 'kmc_farmer_mode',
  VOICE_ENABLED: 'voiceEnabled',
};

// Dev Quick Login roles
export const DEV_LOGIN_ROLES = [
  { id: 'farmer', label: 'Farmer' },
  { id: 'field-officer', label: 'Field Officer' },
  { id: 'super_admin', label: 'Super Admin' },
  { id: 'admin', label: 'Admin' },
  { id: 'tech_admin', label: 'Tech Admin' },
  { id: 'agri_expert', label: 'Agri Expert' },
  { id: 'ecommerce_manager', label: 'E-commerce' },
  { id: 'order_manager', label: 'Order Manager' },
  { id: 'support_agent', label: 'Support Agent' },
  { id: 'support_manager', label: 'Support Manager' },
  { id: 'content_manager', label: 'Content Manager' },
  { id: 'finance_manager', label: 'Finance Manager' },
  { id: 'field_agent', label: 'Field Agent' },
];
