import { verifyToken } from '../auth/jwtHelper.js';
import HttpError from '../errors/HttpError.js';

/**
 * JWT authentication middleware.
 * Extracts token from cookie or Authorization header, verifies it,
 * and attaches decoded user info to req.user.
 */
const authenticate = (req, res, next) => {
  try {
    let token = null;

    // 1. Check cookie first (browser clients)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. Check Authorization header (API clients / mobile)
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      throw HttpError.unauthorized('Authentication required. Please log in.');
    }

    const decoded = verifyToken(token);

    if (!decoded.id) {
      throw HttpError.unauthorized('Invalid token payload');
    }

    // Attach user context to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      type: decoded.type,
    };

    // Legacy compatibility
    req.userId = decoded.id;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(HttpError.unauthorized('Token expired. Please log in again.', 'TOKEN_EXPIRED'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(HttpError.unauthorized('Invalid token. Please log in again.', 'INVALID_TOKEN'));
    }
    next(error);
  }
};

/**
 * Optional authentication — does not throw if no token present.
 * Sets req.user to null if unauthenticated.
 */
const optionalAuth = (req, res, next) => {
  try {
    let token = req.cookies?.token || null;
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') token = parts[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      req.user = { id: decoded.id, role: decoded.role, type: decoded.type };
      req.userId = decoded.id;
    } else {
      req.user = null;
    }
    next();
  } catch {
    req.user = null;
    next();
  }
};

export { authenticate, optionalAuth };
