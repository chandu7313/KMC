import AppError from './AppError.js';

/**
 * HTTP-specific error with named factory methods for common status codes.
 */
class HttpError extends AppError {
  constructor(message, statusCode, code, details = null) {
    super(message, statusCode, code, true, details);
  }

  static badRequest(message = 'Bad Request', code = 'BAD_REQUEST', details = null) {
    return new HttpError(message, 400, code, details);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED', details = null) {
    return new HttpError(message, 401, code, details);
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN', details = null) {
    return new HttpError(message, 403, code, details);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND', details = null) {
    return new HttpError(message, 404, code, details);
  }

  static conflict(message = 'Resource already exists', code = 'CONFLICT', details = null) {
    return new HttpError(message, 409, code, details);
  }

  static unprocessable(message = 'Unprocessable Entity', code = 'UNPROCESSABLE', details = null) {
    return new HttpError(message, 422, code, details);
  }

  static tooManyRequests(message = 'Too many requests. Please try again later.', code = 'RATE_LIMITED', details = null) {
    return new HttpError(message, 429, code, details);
  }

  static internal(message = 'Internal Server Error', code = 'INTERNAL_ERROR', details = null) {
    return new HttpError(message, 500, code, details);
  }

  static serviceUnavailable(message = 'Service temporarily unavailable', code = 'SERVICE_UNAVAILABLE', details = null) {
    return new HttpError(message, 503, code, details);
  }

  static gatewayTimeout(message = 'Gateway timeout', code = 'GATEWAY_TIMEOUT', details = null) {
    return new HttpError(message, 504, code, details);
  }
}

export default HttpError;
