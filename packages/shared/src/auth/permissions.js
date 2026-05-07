/**
 * System-wide Role definitions.
 */
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  TECH_ADMIN: 'tech_admin',
  AGRI_EXPERT: 'agri_expert',
  ECOMMERCE_MANAGER: 'ecommerce_manager',
  ORDER_MANAGER: 'order_manager',
  SUPPORT_AGENT: 'support_agent',
  CONTENT_MANAGER: 'content_manager',
  FINANCE_MANAGER: 'finance_manager',
  FIELD_AGENT: 'field_agent',
  FARMER: 'farmer',
};

// Convenience array of all roles
const ALL_ROLES = Object.values(ROLES);

/**
 * RBAC Permission Matrix mapping specific permissions to the roles that have them.
 */
const PERMISSIONS = {
  // --- Auth Service ---
  'auth:read': ALL_ROLES,
  'auth:manage': [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],

  // --- User Service ---
  'users:read_all': [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.SUPPORT_AGENT],
  'users:read_own': [ROLES.FARMER, ROLES.FIELD_AGENT],
  'users:update_all': [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
  'users:update_own': ALL_ROLES,
  'users:delete': [ROLES.SUPER_ADMIN],
  'users:manage_roles': [ROLES.SUPER_ADMIN],

  // --- Disease Service ---
  'disease:scan': [ROLES.FARMER],
  'disease:read_own': [ROLES.FARMER],
  'disease:read_all': [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.AGRI_EXPERT, ROLES.SUPPORT_AGENT],
  'disease:review': [ROLES.AGRI_EXPERT, ROLES.SUPER_ADMIN],
  'disease:manage_library': [ROLES.AGRI_EXPERT, ROLES.SUPER_ADMIN],

  // --- Soil Service ---
  'soil:test': [ROLES.FARMER],
  'soil:read_own': [ROLES.FARMER],
  'soil:read_all': [ROLES.SUPER_ADMIN, ROLES.AGRI_EXPERT, ROLES.SUPPORT_AGENT, ROLES.FIELD_AGENT],
  'soil:review': [ROLES.AGRI_EXPERT, ROLES.SUPER_ADMIN],

  // --- Market Service ---
  'market:read': ALL_ROLES,
  'market:manage': [ROLES.SUPER_ADMIN, ROLES.AGRI_EXPERT],

  // --- E-Commerce Service ---
  'products:read': ALL_ROLES,
  'products:manage': [ROLES.SUPER_ADMIN, ROLES.ECOMMERCE_MANAGER],
  'cart:manage_own': [ROLES.FARMER],
  'vendors:manage': [ROLES.SUPER_ADMIN, ROLES.ECOMMERCE_MANAGER],
  'inventory:manage': [ROLES.SUPER_ADMIN, ROLES.ECOMMERCE_MANAGER],

  // --- Order Service ---
  'orders:read_own': [ROLES.FARMER],
  'orders:read_all': [
    ROLES.SUPER_ADMIN,
    ROLES.ECOMMERCE_MANAGER,
    ROLES.ORDER_MANAGER,
    ROLES.SUPPORT_AGENT,
    ROLES.FINANCE_MANAGER,
  ],
  'orders:process': [ROLES.SUPER_ADMIN, ROLES.ORDER_MANAGER, ROLES.ECOMMERCE_MANAGER],
  'orders:manage_returns': [ROLES.SUPER_ADMIN, ROLES.ORDER_MANAGER],

  // --- Payment Service ---
  'payments:read_own': [ROLES.FARMER],
  'payments:read_all': [ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER],
  'payments:process_refund': [ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER],
  'payments:view_settlements': [ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER],

  // --- Support Service ---
  'tickets:create': [ROLES.FARMER, ROLES.SUPPORT_AGENT, ROLES.SUPER_ADMIN],
  'tickets:read_own': [ROLES.FARMER],
  'tickets:read_all': [ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT],
  'tickets:manage': [ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT],
  'tickets:delete': [ROLES.SUPER_ADMIN],

  // --- Expert Service ---
  'experts:book': [ROLES.FARMER],
  'experts:manage': [ROLES.SUPER_ADMIN, ROLES.AGRI_EXPERT],
  'experts:view_all': [ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT, ROLES.AGRI_EXPERT],

  // --- Content Service ---
  'content:read': ALL_ROLES,
  'content:manage': [ROLES.SUPER_ADMIN, ROLES.CONTENT_MANAGER],
  'content:publish': [ROLES.SUPER_ADMIN, ROLES.CONTENT_MANAGER],

  // --- Analytics Service ---
  'analytics:read_own': [ROLES.FARMER],
  'analytics:read_all': [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.FINANCE_MANAGER],
  'analytics:export': [ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER, ROLES.TECH_ADMIN],

  // --- Notification Service ---
  'notifications:send': [ROLES.SUPER_ADMIN, ROLES.CONTENT_MANAGER, ROLES.SUPPORT_AGENT],
  'notifications:manage': [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],

  // --- Field Service ---
  'field:manage_own': [ROLES.FIELD_AGENT],
  'field:manage_all': [ROLES.SUPER_ADMIN],
  'field:view_farmers': [ROLES.FIELD_AGENT, ROLES.SUPER_ADMIN],
};

/**
 * Check if a specific role has a given permission.
 * 
 * @param {string} role - The user's role
 * @param {string} permission - The required permission string (e.g., 'orders:process')
 * @returns {boolean} True if the role has the permission
 */
const hasPermission = (role, permission) => {
  // Super admin implicitly has all permissions (fail-safe)
  if (role === ROLES.SUPER_ADMIN) {
    return true;
  }
  
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) {
    return false; // Permission string not found
  }
  
  return allowedRoles.includes(role);
};

/**
 * Get an array of all permissions available to a specific role.
 * Useful for returning to the frontend or JWT embedding (if needed).
 * 
 * @param {string} role - The user's role
 * @returns {string[]} Array of permission strings
 */
const getPermissions = (role) => {
  // If Super Admin, you could optionally return Object.keys(PERMISSIONS)
  // but usually it's better to explicitly calculate what they have assigned
  
  const userPermissions = [];
  
  for (const [permission, allowedRoles] of Object.entries(PERMISSIONS)) {
    // Super admin bypass or explicit check
    if (role === ROLES.SUPER_ADMIN || allowedRoles.includes(role)) {
      userPermissions.push(permission);
    }
  }
  
  return userPermissions;
};

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission,
  getPermissions,
};
