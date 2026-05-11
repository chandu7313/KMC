/**
 * API Service Configuration
 * Maps each backend microservice to its gateway route prefix.
 * All calls go through the Nginx gateway, so the base URL is the same.
 */

const API = {
  AUTH: '/api/auth',
  USER: '/api/user',
  CART: '/api/cart',
  PRODUCT: '/api/product',
  ORDER: '/api/order',
  DISEASE: '/api/crop-doctor',
  SOIL: '/api/soil',
  MARKET: '/api/market',
  BOOKING: '/api/booking',
  EXPERT: '/api/expert',
  SUPPORT: '/api/support',
  NOTIFICATION: '/api/notification',
  BLOG: '/api/blog',
  CONTENT: '/api/content',
  SURVEY: '/api/survey',
  ANALYTICS: '/api/analytics',
  FERTILIZER: '/api/fertilizer',
  EQUIPMENT: '/api/equipment',
  SCHEME: '/api/scheme',
  SUCCESS_STORY: '/api/success-story',
};

export default API;
