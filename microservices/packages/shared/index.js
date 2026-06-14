/**
 * @kissan/shared — barrel export
 * Central entry point for all shared utilities across microservices.
 */

// Logger
export { default as createLogger } from './logger/winston.js';

// Errors
export { default as AppError } from './errors/AppError.js';
export { default as HttpError } from './errors/HttpError.js';
export { default as ValidationError } from './errors/ValidationError.js';

// Response helpers
export { successResponse, paginatedResponse, createdResponse, noContentResponse } from './response/success.js';
export { errorResponse } from './response/error.js';

// Auth
export { signAccessToken, signRefreshToken, verifyToken, decodeToken } from './auth/jwtHelper.js';
export { ROLES, PERMISSIONS, hasPermission, isAdminRole, getRolePermissions } from './auth/rbac.js';

// Database clients
export { getSequelize, checkSequelizeHealth, disconnectSequelize } from './database/sequelize.js';
export { default as models } from './models/index.js';

// No longer aliasing Sequelize, exporting actual JS client
export { supabaseClient } from './database/supabase.js';

export { connectMongoDB, disconnectMongoDB, checkMongoHealth } from './database/mongodb.js';
export {
  getRedisClient, REDIS_DBS,
  getAuthRedis, getCartRedis, getCacheRedis, getRateLimitRedis,
  checkRedisHealth, disconnectAllRedis,
} from './database/redis.js';

// Middleware
export { authenticate, optionalAuth } from './middleware/authenticate.js';
export { authorize, authorizeAny, authorizeOwnerOrAdmin } from './middleware/authorize.js';
export { rateLimiter, authRateLimiter, otpRateLimiter, userRateLimiter } from './middleware/rateLimiter.js';
export { default as requestId } from './middleware/requestId.js';
export { validate, validateAll } from './middleware/validator.js';

// Metrics (Prometheus)
export * as metrics from './metrics/metrics.js';
