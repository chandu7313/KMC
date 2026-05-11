/**
 * Route Configuration
 * Single source of truth for all application routes.
 * Use these constants instead of hardcoding path strings.
 */

export const ROUTES = {
  // ─── Public ──────────────────
  HOME: '/',
  LOGIN: '/login',
  EMAIL_VERIFY: '/email-verify',
  RESET_PASSWORD: '/reset-password',
  ABOUT: '/about',
  CONTACT: '/contact',
  BLOGS: '/blogs',
  BLOG_DETAIL: '/blog/:slug',
  PACKAGES: '/packages',
  SUCCESS_STORIES: '/success-stories',
  CUSTOMER_CARE: '/customer-care',

  // ─── Farmer ──────────────────
  FARMER_DASHBOARD: '/farmer/dashboard',
  PROFILE: '/profile',
  ONBOARDING_SURVEY: '/onboarding-survey',
  CROP_DOCTOR: '/crop-doctor',
  SOIL_ANALYSIS: '/soil-crop-analysis',
  SOIL_HISTORY: '/soil-history',
  MARKET_PRICES: '/market-prices',
  WEATHER_INSIGHTS: '/whether-insights',
  CROP_SELECTION: '/crop-selection',
  GOVERNMENT_SCHEMES: '/government-schemes',
  EXPERT_CONSULTATIONS: '/expert-consultations',
  BOOK_FARM_VISIT: '/book-farm-visit',
  ORCHARD_PLANNING: '/orchard-planning',
  ORCHARD_PLAN_FORM: '/orchard-planning/plan',

  // ─── Ecommerce ───────────────
  MARKETPLACE: '/marketplace',
  PRODUCT_DETAIL: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  FERTILIZERS: '/fertilizers',
  EQUIPMENTS: '/equipments',
  MY_ORDERS: '/my-orders',

  // ─── Admin ───────────────────
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_FARMERS: '/admin/farmers',
  ADMIN_MARKET: '/admin/market',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_SUCCESS_STORIES: '/admin/success-stories',
  ADMIN_BLOGS: '/admin/blogs',
  ADMIN_FERTILIZERS: '/admin/fertilizers',
  ADMIN_EQUIPMENTS: '/admin/equipments',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SOIL_TESTS: '/admin/soil-tests',
  ADMIN_SOIL_ENTRY: '/admin/soil-entry',
  ADMIN_INVENTORY: '/admin/inventory',

  // ─── Support Portal ──────────
  SUPPORT: '/admin/support',
  SUPPORT_TICKETS: '/admin/support/tickets',
  SUPPORT_TICKET_DETAIL: '/admin/support/tickets/:id',
  SUPPORT_FARMERS: '/admin/support/farmers',
  SUPPORT_FARMER_DETAIL: '/admin/support/farmers/:id',
  SUPPORT_BOOKINGS: '/admin/support/bookings',
  SUPPORT_TEMPLATES: '/admin/support/templates',
  SUPPORT_NOTIFICATIONS: '/admin/support/notifications',
  SUPPORT_REPORTS: '/admin/support/reports',
  SUPPORT_AGENTS: '/admin/support/agents',
  SUPPORT_SETTINGS: '/admin/support/settings',

  // ─── Super Admin ─────────────
  SUPER_ADMIN: '/super-admin',
  SUPER_ADMIN_DASHBOARD: '/super-admin/dashboard',
};

export default ROUTES;
