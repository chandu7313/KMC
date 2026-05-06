import AppError from './AppError.js';

/**
 * Validation error — wraps Joi validation failures into a structured error.
 */
class ValidationError extends AppError {
  /**
   * @param {string} message - Summary message
   * @param {Array<object>} errors - Array of field-level validation errors
   */
  constructor(message = 'Validation failed', errors = []) {
    super(message, 400, 'VALIDATION_ERROR', true, { errors });
    this.validationErrors = errors;
  }

  /**
   * Create from a Joi validation result.
   * @param {object} joiError - Joi error object (error.details)
   * @returns {ValidationError}
   */
  static fromJoi(joiError) {
    const errors = joiError.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/"/g, ''),
      type: detail.type,
    }));
    return new ValidationError('Validation failed', errors);
  }
}

export default ValidationError;
