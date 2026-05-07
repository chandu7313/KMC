/**
 * Base custom error class for all application operational errors.
 * Extends the native Error class and standardizes error properties.
 */
class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * 
   * @param {string} message - Human readable error message
   * @param {number} [statusCode=500] - HTTP status code
   * @param {string} [code='INTERNAL_ERROR'] - Application specific error code
   * @param {any} [details=null] - Additional error details (e.g., validation errors)
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    // Capture stack trace, excluding the constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Format the error object to JSON response structure.
   * 
   * @returns {Object} Standardized error response
   */
  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        code: this.code,
        details: this.details,
      },
    };
  }
}

module.exports = AppError;
