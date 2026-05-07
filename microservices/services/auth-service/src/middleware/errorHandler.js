import { errorResponse, createLogger, AppError } from '@kissan/shared';

const logger = createLogger('auth-service');

/**
 * Global error handler middleware.
 * Catches all errors and returns a structured JSON response.
 */
export const errorHandler = (err, req, res, _next) => {
  // Log the error
  if (err instanceof AppError && err.isOperational) {
    logger.warn(`Operational error: ${err.message}`, {
      code: err.code,
      statusCode: err.statusCode,
      requestId: req.requestId,
      path: req.path,
    });
  } else {
    logger.error(`Unexpected error: ${err.message}`, {
      stack: err.stack,
      requestId: req.requestId,
      path: req.path,
      method: req.method,
    });
  }

  return errorResponse(res, err);
};
