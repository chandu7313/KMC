const { UnauthorizedError } = require('@kissan-mithar/shared');

/**
 * Inter-service authentication middleware.
 * Ensures that incoming HTTP requests originate from other trusted microservices
 * within the private network, rather than from external clients.
 */
const serviceAuth = (req, res, next) => {
  try {
    const serviceKey = req.headers['x-service-key'];
    
    // Check if the service key is present and matches the configured secret
    if (!serviceKey || serviceKey !== process.env.INTERNAL_SERVICE_SECRET) {
      throw new UnauthorizedError('Invalid or missing internal service key');
    }

    // Optional: Only allow requests from private IP ranges (e.g., Kubernetes cluster IPs)
    // const clientIp = req.ip || req.connection.remoteAddress;
    // const isPrivateIp = /^(::f{4}:)?10\.|^127\.|^192\.168\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clientIp);
    // if (!isPrivateIp) {
    //   throw new UnauthorizedError('Service requests must originate from private network');
    // }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = serviceAuth;
