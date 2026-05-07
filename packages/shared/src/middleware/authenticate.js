const { verifyAccessToken } = require('../auth/jwtHelper');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { logger } = require('../logger/winston');

/**
 * Express middleware to authenticate users via JWT.
 * Extracts token from 'Authorization: Bearer <token>' or 'access_token' cookie.
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // 2. Alternatively, check cookies
    else if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      throw new UnauthorizedError('Authentication required. Please log in.');
    }

    // 3. Verify Token
    const decoded = await verifyAccessToken(token);

    // 4. Attach user payload to the request object
    req.user = decoded;

    next();
  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`);
    next(error); // Passes the UnauthorizedError to the errorHandler
  }
};

module.exports = authenticate;
