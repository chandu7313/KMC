import { hasPermission } from '../auth/rbac.js';
import HttpError from '../errors/HttpError.js';

/**
 * Authorization middleware factory.
 * Checks if the authenticated user has the required permission(s).
 *
 * @param {...string} requiredPermissions - One or more permission keys
 * @returns {Function} Express middleware
 *
 * @example
 * router.get('/orders', authenticate, authorize('orders:read'), getOrders);
 * router.delete('/users/:id', authenticate, authorize('users:manage'), deleteUser);
 */
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(HttpError.unauthorized('Authentication required'));
    }

    const { role } = req.user;

    // Check if user has ALL required permissions
    const hasAll = requiredPermissions.every((perm) => hasPermission(role, perm));

    if (!hasAll) {
      return next(
        HttpError.forbidden(
          `Access denied. Your role (${role}) does not have permission for this action.`,
          'INSUFFICIENT_PERMISSIONS',
          { required: requiredPermissions, userRole: role }
        )
      );
    }

    next();
  };
};

/**
 * Authorization middleware that checks if user has ANY of the permissions.
 * @param {...string} permissions
 * @returns {Function}
 */
const authorizeAny = (...permissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(HttpError.unauthorized('Authentication required'));
    }

    const hasAny = permissions.some((perm) => hasPermission(req.user.role, perm));

    if (!hasAny) {
      return next(
        HttpError.forbidden(
          `Access denied. Insufficient permissions.`,
          'INSUFFICIENT_PERMISSIONS'
        )
      );
    }

    next();
  };
};

/**
 * Middleware to check if user is accessing their own resource.
 * Compares req.user.id with req.params[paramName].
 * Falls back to permission check for admin roles.
 *
 * @param {string} paramName - Route param containing the resource owner ID
 * @param {string} adminPermission - Permission that allows admin override
 * @returns {Function}
 */
const authorizeOwnerOrAdmin = (paramName = 'id', adminPermission = 'users:manage') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(HttpError.unauthorized('Authentication required'));
    }

    const resourceOwnerId = req.params[paramName];
    const isOwner = req.user.id === resourceOwnerId;
    const isAdmin = hasPermission(req.user.role, adminPermission);

    if (!isOwner && !isAdmin) {
      return next(HttpError.forbidden('You can only access your own resources'));
    }

    req.isOwner = isOwner;
    next();
  };
};

export { authorize, authorizeAny, authorizeOwnerOrAdmin };
