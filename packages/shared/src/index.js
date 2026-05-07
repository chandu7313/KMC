module.exports = {
  // Auth
  jwtHelper: require('./auth/jwtHelper'),
  rbac: require('./auth/rbac'),
  permissions: require('./auth/permissions'),
  
  // Database
  supabase: require('./database/supabase'),
  mongodb: require('./database/mongodb'),
  redis: require('./database/redis'),
  
  // Errors
  AppError: require('./errors/AppError'),
  HttpError: require('./errors/HttpError'),
  ValidationError: require('./errors/ValidationError'),
  NotFoundError: require('./errors/NotFoundError'),
  UnauthorizedError: require('./errors/UnauthorizedError'),
  ForbiddenError: require('./errors/ForbiddenError'),
  
  // Middleware
  authenticate: require('./middleware/authenticate'),
  authorize: require('./middleware/authorize'),
  rateLimiter: require('./middleware/rateLimiter'),
  requestId: require('./middleware/requestId'),
  validate: require('./middleware/validate'),
  errorHandler: require('./middleware/errorHandler'),
  notFound: require('./middleware/notFound'),
  
  // Response
  sendSuccess: require('./response/success').sendSuccess,
  sendPaginated: require('./response/success').sendPaginated,
  
  // Logger
  logger: require('./logger/winston').logger,
  httpLogger: require('./logger/winston').httpLogger,
  
  // Utils
  asyncWrapper: require('./utils/asyncWrapper'),
  pagination: require('./utils/pagination'),
  phoneHelper: require('./utils/phoneHelper'),
  fileUpload: require('./utils/fileUpload'),
  encryption: require('./utils/encryption'),
};
