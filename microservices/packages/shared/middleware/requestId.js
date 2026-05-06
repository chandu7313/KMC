import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware that injects a unique request ID into every request.
 * Used for distributed tracing across microservices.
 *
 * - If the incoming request already has X-Request-ID (from gateway), it reuses it.
 * - Otherwise generates a new UUID v4.
 * - Sets it on req.requestId and as a response header.
 */
const requestId = (req, res, next) => {
  const id = req.headers['x-request-id'] || uuidv4();

  req.requestId = id;
  res.setHeader('X-Request-ID', id);

  next();
};

export default requestId;
