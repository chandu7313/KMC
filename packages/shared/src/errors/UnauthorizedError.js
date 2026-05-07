const AppError = require('./AppError');

/**
 * Error class specifically for 401 Unauthorized scenarios.
 */
class UnauthorizedError extends AppError {
  /**
   * Creates an instance of UnauthorizedError.
   * 
   * @param {string} [message='Unauthorized access'] - Custom unauthorized message
   */
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

module.exports = UnauthorizedError;
