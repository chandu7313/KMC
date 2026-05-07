/**
 * Application-wide constants for Kissan Mithar Consultancy Microservices.
 * Import these constants to ensure consistency across all services.
 */

const constants = {
  // Pagination
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,

  // File Upload
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  // OTP Configurations
  OTP_LENGTH: 6,
  OTP_TTL: 5 * 60, // 5 minutes in seconds
  OTP_MAX_ATTEMPTS: 3,

  // Token Configurations
  ACCESS_TOKEN_TTL: '24h',
  REFRESH_TOKEN_TTL: '7d',

  // Rate Limits
  GLOBAL_RATE_LIMIT: 100, // per minute
  AUTH_RATE_LIMIT: 10,    // per 15 minutes
  API_RATE_LIMIT: 1000,   // per hour

  // Service Level Agreements (in hours)
  SLA: {
    CRITICAL: { first_response: 0.5, resolution: 4 },
    HIGH: { first_response: 2, resolution: 24 },
    MEDIUM: { first_response: 8, resolution: 48 },
    LOW: { first_response: 24, resolution: 72 },
  },

  // Order Status Flow
  ORDER_STATUS: {
    NEW: 'new',
    PROCESSING: 'processing',
    PACKED: 'packed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    RETURN_REQUESTED: 'return_requested',
    RETURNED: 'returned',
  },

  // Notification Channels
  NOTIFICATION_CHANNELS: {
    EMAIL: 'email',
    SMS: 'sms',
    PUSH: 'push',
    WHATSAPP: 'whatsapp',
  },

  // Supported Languages
  SUPPORTED_LANGUAGES: ['en', 'hi', 'te'],

  // Role Definitions
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    TECH_ADMIN: 'tech_admin',
    AGRI_EXPERT: 'agri_expert',
    ECOMMERCE_MANAGER: 'ecommerce_manager',
    ORDER_MANAGER: 'order_manager',
    SUPPORT_AGENT: 'support_agent',
    CONTENT_MANAGER: 'content_manager',
    FINANCE_MANAGER: 'finance_manager',
    FIELD_AGENT: 'field_agent',
    FARMER: 'farmer',
  },

  // Role Groupings
  ADMIN_ROLES: [
    'super_admin',
    'tech_admin',
    'agri_expert',
    'ecommerce_manager',
    'order_manager',
    'support_agent',
    'content_manager',
    'finance_manager',
    'field_agent',
  ],
  
  FARMER_ROLE: 'farmer',
};

module.exports = constants;
