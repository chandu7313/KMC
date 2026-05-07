import { errorResponse, createLogger, AppError } from '@kissan/shared';
const logger = createLogger('market-service');
export const errorHandler = (err, req, res, _next) => {
  if (err instanceof AppError && err.isOperational) logger.warn(`${err.message}`, { code: err.code, path: req.path });
  else logger.error(`${err.message}`, { stack: err.stack, path: req.path });
  return errorResponse(res, err);
};
