const NotFoundError = require('../errors/NotFoundError');

/**
 * Fallback middleware to handle unmatched routes (404 Not Found).
 */
const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl}`));
};

module.exports = notFoundHandler;
