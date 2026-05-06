import ValidationError from '../errors/ValidationError.js';

/**
 * Joi validation middleware factory.
 * Validates request body, query, or params against a Joi schema.
 *
 * @param {import('joi').ObjectSchema} schema - Joi validation schema
 * @param {string} [source='body'] - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware
 *
 * @example
 * import Joi from 'joi';
 * const loginSchema = Joi.object({
 *   email: Joi.string().email().required(),
 *   password: Joi.string().min(6).required(),
 * });
 * router.post('/login', validate(loginSchema), authController.login);
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return next(ValidationError.fromJoi(error));
    }

    // Replace with validated + sanitized data
    req[source] = value;
    next();
  };
};

/**
 * Validate multiple sources at once.
 * @param {object} schemas - { body: Joi.Schema, query: Joi.Schema, params: Joi.Schema }
 * @returns {Function}
 */
const validateAll = (schemas) => {
  return (req, res, next) => {
    const allErrors = [];

    for (const [source, schema] of Object.entries(schemas)) {
      const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      });

      if (error) {
        allErrors.push(...error.details);
      } else {
        req[source] = value;
      }
    }

    if (allErrors.length > 0) {
      const errors = allErrors.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
        type: detail.type,
      }));
      return next(new ValidationError('Validation failed', errors));
    }

    next();
  };
};

export { validate, validateAll };
