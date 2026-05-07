const { v4: uuidv4 } = require('uuid');
const { asyncLocalStorage } = require('../logger/winston');

/**
 * Express middleware to attach a unique request ID to every incoming HTTP request.
 * Useful for correlating logs across different microservices.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const requestIdMiddleware = (req, res, next) => {
  // Use existing X-Request-ID if provided by API Gateway/upstream, otherwise generate a new UUID
  const requestId = req.headers['x-request-id'] || uuidv4();

  // Attach to the request object for easy access in controllers
  req.id = requestId;

  // Set the header on the response so the client/caller receives it
  res.setHeader('X-Request-ID', requestId);

  // Initialize AsyncLocalStorage with the requestId. 
  // Any logging inside this context will automatically append the requestId.
  asyncLocalStorage.run({ requestId }, () => {
    next();
  });
};

module.exports = requestIdMiddleware;
