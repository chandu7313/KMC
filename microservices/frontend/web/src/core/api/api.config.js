/**
 * API Service Configuration
 * Maps each backend microservice to its gateway route prefix.
 * All calls go through the Nginx gateway, so the base URL is the same.
 */

const API = {
  AUTH: '/api/auth',
  USER: '/api/users',
  CART: '/api/cart',
  PRODUCT: '/api/products',
  ORDER: '/api/orders',
  DISEASE: '/api/disease',
  SOIL: '/api/soil',
  MARKET: '/api/market',
  BOOKING: '/api/booking',
  EXPERT: '/api/experts',
  SUPPORT: '/api/support',
  NOTIFICATION: '/api/notify',
  BLOG: '/api/blog',
  CONTENT: '/api/content',
  SURVEY: '/api/survey',
  ANALYTICS: '/api/analytics',
  FERTILIZER: '/api/fertilizer',
  EQUIPMENT: '/api/equipment',
  SCHEME: '/api/scheme',
  SUCCESS_STORY: '/api/success-story',
  FIELD: '/api/field',
};

export default API;
