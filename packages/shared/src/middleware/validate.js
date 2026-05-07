const ValidationError = require('../errors/ValidationError');

/**
 * Joi validation middleware factory.
 * 
 * @param {import('joi').ObjectSchema} schema - The Joi schema to validate against
 * @param {string} [source='body'] - The request property to validate ('body', 'query', 'params', 'headers')
 * @returns {import('express').RequestHandler}
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    // Perform Joi validation
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,      // Return all errors, not just the first one
      stripUnknown: true,     // Remove any fields that are not in the schema
    });

    if (error) {
      // Throw custom ValidationError which formats the Joi error object cleanly
      return next(new ValidationError(error));
    }

    // Replace request data with validated/sanitized value
    req[source] = value;
    next();
  };
};

module.exports = validate;
