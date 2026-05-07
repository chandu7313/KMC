const AppError = require('./AppError');

/**
 * Error class specifically for 403 Forbidden scenarios.
 */
class ForbiddenError extends AppError {
  /**
   * Creates an instance of ForbiddenError.
   * 
   * @param {string} [message='Access denied'] - Custom forbidden message
   */
  constructor(message = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

module.exports = ForbiddenError;
