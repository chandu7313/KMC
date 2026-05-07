const ForbiddenError = require('../errors/ForbiddenError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { hasPermission, ROLES } = require('./permissions');
const { logger } = require('../logger/winston');

/**
 * Middleware factory to enforce specific RBAC permissions.
 * Assumes `req.user` is already populated by an authentication middleware.
 * 
 * @param {string} permission - The required permission string (e.g., 'orders:process')
 * @returns {import('express').RequestHandler} Express middleware function
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const { role } = req.user;

      // Super admin always passes
      if (role === ROLES.SUPER_ADMIN) {
        return next();
      }

      // Check against the centralized permission matrix
      if (!hasPermission(role, permission)) {
        logger.warn(`User ${req.user.id} (Role: ${role}) denied access to permission: ${permission}`);
        throw new ForbiddenError(`You don't have permission to perform this action (${permission})`);
      }

      // Note: 'own' data checks (e.g., 'orders:read_own') typically require further validation 
      // within the controller logic or subsequent middlewares since the resource ID isn't 
      // globally predictable here, but the role check passes if they possess the permission.
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware factory to strictly require one of the specified roles.
 * 
 * @param {...string} roles - Array of permitted roles
 * @returns {import('express').RequestHandler} Express middleware function
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userRole = req.user.role;

      // Super admin always passes
      if (userRole === ROLES.SUPER_ADMIN) {
        return next();
      }

      if (!roles.includes(userRole)) {
        logger.warn(`User ${req.user.id} (Role: ${userRole}) denied access. Required roles: ${roles.join(', ')}`);
        throw new ForbiddenError('Your role does not permit this action');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware factory to ensure the user is modifying their own resource,
 * unless they are an admin.
 * 
 * @param {string} [userIdParam='userId'] - The req.params key containing the target user ID
 * @returns {import('express').RequestHandler} Express middleware function
 */
const requireSelf = (userIdParam = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const currentUserId = req.user.id;
      const targetUserId = req.params[userIdParam];
      const userRole = req.user.role;

      // If user is operating on their own data, allow them
      if (currentUserId === targetUserId) {
        return next();
      }

      // If they are not operating on their own data, check if they are an admin
      const adminRoles = [
        ROLES.SUPER_ADMIN, 
        ROLES.TECH_ADMIN, 
        ROLES.SUPPORT_AGENT
      ]; // Extend this list based on specific use cases if needed
      
      if (adminRoles.includes(userRole)) {
        return next();
      }

      logger.warn(`User ${currentUserId} attempted to access data of user ${targetUserId}`);
      throw new ForbiddenError('You can only access or modify your own resources');
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  requirePermission,
  requireRole,
  requireSelf,
};
