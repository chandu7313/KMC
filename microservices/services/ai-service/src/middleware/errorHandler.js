import { errorResponse, createLogger, AppError } from '@kissan/shared';
const logger = createLogger('ai-service');
export const errorHandler = (err, req, res, _next) => {
  if (err instanceof AppError && err.isOperational) {
    logger.warn(`Operational: ${err.message}`, { code: err.code, path: req.path });
  } else {
    logger.error(`Unexpected: ${err.message}`, { stack: err.stack, path: req.path });
  }
  return errorResponse(res, err);
};
