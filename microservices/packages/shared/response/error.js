import AppError from '../errors/AppError.js';

/**
 * Standard error response builder.
 * Handles both operational AppErrors and unexpected errors.
 */
const errorResponse = (res, error) => {
  // Known operational error
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details && { details: error.details }),
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Sequelize unique constraint violation
  if (error.name === 'SequelizeUniqueConstraintError' || error.code === '23505') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: 'A record with this information already exists',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Mongoose validation error
  if (error.name === 'ValidationError' && error.errors) {
    const errors = Object.values(error.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { errors },
      },
      timestamp: new Date().toISOString(),
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      },
      timestamp: new Date().toISOString(),
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Unknown / unexpected error
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred. Please try again.'
        : error.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
    },
    timestamp: new Date().toISOString(),
  });
};

export { errorResponse };
