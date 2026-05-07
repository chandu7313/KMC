/**
 * Wraps async Express route handlers and automatically catches Promise rejections.
 * Passes them to the global error handler middleware via next().
 * This eliminates the need for try-catch blocks in controllers.
 * 
 * @param {Function} fn - Async controller function
 * @returns {import('express').RequestHandler}
 */
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncWrapper;
