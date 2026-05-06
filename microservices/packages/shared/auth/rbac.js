/**
 * Role-Based Access Control (RBAC) configuration.
 * Defines permissions for every role across all services.
 *
 * Permission levels:
 *   ALL  = full CRUD access
 *   R    = read-only access
 *   OWN  = own data only (user-scoped)
 *   NONE = no access
 */

const ROLES = {
  SUPER_ADMIN: 'super_admin',
  TECH_ADMIN: 'tech_admin',
  ADMIN: 'admin',
  AGRI_EXPERT: 'agri_expert',
  ECOMMERCE_MANAGER: 'ecommerce_manager',
  ORDER_MANAGER: 'order_manager',
  SUPPORT_AGENT: 'support_agent',
  SUPPORT_MANAGER: 'support_manager',
  CONTENT_MANAGER: 'content_manager',
  FINANCE_MANAGER: 'finance_manager',
  FIELD_AGENT: 'field_agent',
  FARMER: 'user',
  FIELD_OFFICER: 'field-officer',
};

const PERMISSIONS = {
  // auth-service
  'auth:read':        [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.FARMER],
  'auth:manage':      [ROLES.SUPER_ADMIN],

  // user-service
  'users:read':       [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.AGRI_EXPERT, ROLES.ECOMMERCE_MANAGER, ROLES.ORDER_MANAGER, ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER, ROLES.CONTENT_MANAGER, ROLES.FINANCE_MANAGER, ROLES.FIELD_AGENT],
  'users:manage':     [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
  'users:own':        [ROLES.FARMER],

  // ai-service
  'ai:read':          [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.FARMER],
  'ai:manage':        [ROLES.SUPER_ADMIN, ROLES.AGRI_EXPERT],

  // disease-service
  'disease:read':     [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER, ROLES.FIELD_AGENT],
  'disease:manage':   [ROLES.SUPER_ADMIN, ROLES.AGRI_EXPERT],
  'disease:own':      [ROLES.FARMER],

  // soil-service
  'soil:read':        [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER, ROLES.FIELD_AGENT],
  'soil:manage':      [ROLES.SUPER_ADMIN, ROLES.AGRI_EXPERT],
  'soil:own':         [ROLES.FARMER],

  // market-service
  'market:read':      [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.FARMER],
  'market:manage':    [ROLES.SUPER_ADMIN, ROLES.AGRI_EXPERT],

  // ecommerce-service
  'products:read':    [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.AGRI_EXPERT, ROLES.ORDER_MANAGER, ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER, ROLES.FINANCE_MANAGER],
  'products:manage':  [ROLES.SUPER_ADMIN, ROLES.ECOMMERCE_MANAGER],
  'products:own':     [ROLES.FARMER],
  'cart:own':         [ROLES.FARMER],

  // order-service
  'orders:read':      [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER, ROLES.FINANCE_MANAGER],
  'orders:manage':    [ROLES.SUPER_ADMIN, ROLES.ECOMMERCE_MANAGER, ROLES.ORDER_MANAGER],
  'orders:own':       [ROLES.FARMER],

  // payment-service
  'payments:read':    [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.ECOMMERCE_MANAGER, ROLES.ORDER_MANAGER],
  'payments:manage':  [ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER],
  'payments:own':     [ROLES.FARMER],

  // notification-service
  'notifications:read':   [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER],
  'notifications:manage': [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.CONTENT_MANAGER],

  // support-service
  'support:read':     [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
  'support:manage':   [ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER],
  'support:own':      [ROLES.FARMER],

  // expert-service
  'experts:read':     [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER],
  'experts:manage':   [ROLES.SUPER_ADMIN, ROLES.AGRI_EXPERT],
  'experts:own':      [ROLES.FARMER],

  // content-service
  'content:read':     [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.AGRI_EXPERT, ROLES.FARMER],
  'content:manage':   [ROLES.SUPER_ADMIN, ROLES.CONTENT_MANAGER],

  // analytics-service
  'analytics:read':   [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.AGRI_EXPERT, ROLES.ECOMMERCE_MANAGER, ROLES.ORDER_MANAGER, ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER, ROLES.CONTENT_MANAGER, ROLES.FIELD_AGENT],
  'analytics:manage': [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.FINANCE_MANAGER],

  // field-service
  'field:read':       [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER],
  'field:manage':     [ROLES.SUPER_ADMIN, ROLES.FIELD_AGENT],
};

/**
 * Check if a role has a specific permission.
 * @param {string} role - User role
 * @param {string} permission - Permission key (e.g., 'orders:manage')
 * @returns {boolean}
 */
const hasPermission = (role, permission) => {
  // Super admin has ALL permissions
  if (role === ROLES.SUPER_ADMIN) return true;

  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;

  return allowedRoles.includes(role);
};

/**
 * Check if a role is any admin role.
 * @param {string} role
 * @returns {boolean}
 */
const isAdminRole = (role) => {
  const adminRoles = [
    ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.ADMIN,
    ROLES.AGRI_EXPERT, ROLES.ECOMMERCE_MANAGER, ROLES.ORDER_MANAGER,
    ROLES.SUPPORT_AGENT, ROLES.SUPPORT_MANAGER, ROLES.CONTENT_MANAGER,
    ROLES.FINANCE_MANAGER, ROLES.FIELD_AGENT,
  ];
  return adminRoles.includes(role);
};

/**
 * Get all permissions for a given role.
 * @param {string} role
 * @returns {string[]}
 */
const getRolePermissions = (role) => {
  if (role === ROLES.SUPER_ADMIN) return Object.keys(PERMISSIONS);

  return Object.entries(PERMISSIONS)
    .filter(([, roles]) => roles.includes(role))
    .map(([permission]) => permission);
};

export { ROLES, PERMISSIONS, hasPermission, isAdminRole, getRolePermissions };
