const AppError = require('./AppError');

/**
 * Utility class to quickly generate HTTP-specific errors
 * extending the base AppError.
 */
class HttpError extends AppError {
  /**
   * Generates a 400 Bad Request error.
   * 
   * @param {string} [message='Bad Request'] 
   * @param {any} [details=null] 
   * @returns {HttpError}
   */
  static badRequest(message = 'Bad Request', details = null) {
    return new HttpError(message, 400, 'BAD_REQUEST', details);
  }

  /**
   * Generates a 401 Unauthorized error.
   * 
   * @param {string} [message='Unauthorized access'] 
   * @returns {HttpError}
   */
  static unauthorized(message = 'Unauthorized access') {
    return new HttpError(message, 401, 'UNAUTHORIZED');
  }

  /**
   * Generates a 403 Forbidden error.
   * 
   * @param {string} [message='Access denied'] 
   * @returns {HttpError}
   */
  static forbidden(message = 'Access denied') {
    return new HttpError(message, 403, 'FORBIDDEN');
  }

  /**
   * Generates a 404 Not Found error.
   * 
   * @param {string} [resource='Resource'] 
   * @returns {HttpError}
   */
  static notFound(resource = 'Resource') {
    return new HttpError(`${resource} not found`, 404, 'NOT_FOUND');
  }

  /**
   * Generates a 409 Conflict error.
   * 
   * @param {string} [message='Conflict occurred'] 
   * @returns {HttpError}
   */
  static conflict(message = 'Conflict occurred') {
    return new HttpError(message, 409, 'CONFLICT');
  }

  /**
   * Generates a 429 Too Many Requests error.
   * 
   * @param {string} [message='Too many requests, please try again later.'] 
   * @returns {HttpError}
   */
  static tooManyRequests(message = 'Too many requests, please try again later.') {
    return new HttpError(message, 429, 'TOO_MANY_REQUESTS');
  }

  /**
   * Generates a 500 Internal Server Error.
   * 
   * @param {string} [message='Internal server error'] 
   * @returns {HttpError}
   */
  static internal(message = 'Internal server error') {
    return new HttpError(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = HttpError;
