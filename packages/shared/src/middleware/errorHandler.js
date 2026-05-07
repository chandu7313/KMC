const { logger } = require('../logger/winston');
const AppError = require('../errors/AppError');
const HttpError = require('../errors/HttpError');

/**
 * Global Error Handler middleware.
 * Should be registered as the last middleware in the Express application.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log the error natively first
  logger.error(err.message || 'Error occurred', { 
    error: err, 
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user ? req.user.id : 'guest',
  });

  // Mongoose / MongoDB errors mapping
  if (err.name === 'CastError') {
    error = HttpError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }
  if (err.code === 11000) { // Duplicate key error
    const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'Value';
    error = HttpError.conflict(`Duplicate field value entered: ${value}. Please use another value.`);
  }
  if (err.name === 'ValidationError') { // Mongoose validation error
    const messages = Object.values(err.errors).map(val => val.message);
    error = HttpError.badRequest(`Invalid input data. ${messages.join('. ')}`);
  }

  // Supabase PGRST errors mapping
  if (err.code && typeof err.code === 'string' && err.code.startsWith('PGRST')) {
    if (err.code === 'PGRST116') {
      error = HttpError.notFound('Database resource not found');
    } else {
      error = HttpError.badRequest(`Database error: ${err.message}`);
    }
  }

  // Fallback to internal server error if it's not a known operational AppError
  if (!(error instanceof AppError)) {
    error = HttpError.internal(
      process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    );
  }

  // Construct standard error response
  const errorResponse = {
    success: false,
    error: {
      message: error.message,
      code: error.code || 'ERROR',
      details: error.details || undefined,
      requestId: req.id,
      timestamp: new Date().toISOString(),
    }
  };

  // In development mode, append stack trace for debugging
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  res.status(error.statusCode || 500).json(errorResponse);
};

module.exports = errorHandler;
