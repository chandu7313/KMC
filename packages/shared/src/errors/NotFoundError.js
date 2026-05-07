const AppError = require('./AppError');

/**
 * Error class specifically for 404 Not Found scenarios.
 */
class NotFoundError extends AppError {
  /**
   * Creates an instance of NotFoundError.
   * 
   * @param {string} [resource='Resource'] - Name of the resource that was not found
   */
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

module.exports = NotFoundError;
