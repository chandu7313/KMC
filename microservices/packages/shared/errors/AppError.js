/**
 * Base application error class.
 * All custom errors in the platform extend this.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code
   * @param {string} code - Machine-readable error code (e.g., 'AUTH_INVALID_TOKEN')
   * @param {boolean} isOperational - Whether this is an expected operational error
   * @param {object} [details] - Additional error context
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', isOperational = true, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
        ...(process.env.NODE_ENV !== 'production' && { stack: this.stack }),
      },
    };
  }
}

export default AppError;
