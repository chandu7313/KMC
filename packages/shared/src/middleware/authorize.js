const { requirePermission, requireRole, requireSelf } = require('../auth/rbac');

/**
 * Convenience wrapper exporting the RBAC middleware factories.
 * Allows importing `authorize` directly to access these permissions guards.
 */
const authorize = {
  /**
   * Enforces that the authenticated user possesses the specific permission.
   * @param {string} permission 
   */
  permission: requirePermission,
  
  /**
   * Enforces that the authenticated user has one of the required roles.
   * @param {...string} roles 
   */
  roles: requireRole,

  /**
   * Enforces that the authenticated user is accessing their own data (or is an admin).
   * @param {string} userIdParam 
   */
  self: requireSelf,
};

module.exports = authorize;
