import { errorResponse, createLogger, AppError } from '@kissan/shared';

const logger = createLogger('user-service');

export const errorHandler = (err, req, res, _next) => {
  if (err instanceof AppError && err.isOperational) {
    logger.warn(`Operational error: ${err.message}`, {
      code: err.code, statusCode: err.statusCode, path: req.path,
    });
  } else {
    logger.error(`Unexpected error: ${err.message}`, {
      stack: err.stack, path: req.path, method: req.method,
    });
  }
  return errorResponse(res, err);
};
