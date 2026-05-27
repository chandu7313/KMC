/**
 * Frontend RBAC Configuration
 * Single source of truth for role definitions and permissions.
 * Extracted from the hardcoded arrays scattered across AdminLayout, Login, etc.
 */

export const ROLES = {
  FARMER: 'farmer',
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TECH_ADMIN: 'tech_admin',
  AGRI_EXPERT: 'agri_expert',
  ECOMMERCE_MANAGER: 'ecommerce_manager',
  ORDER_MANAGER: 'order_manager',
  SUPPORT_AGENT: 'support_agent',
  SUPPORT_MANAGER: 'support_manager',
  CONTENT_MANAGER: 'content_manager',
  FINANCE_MANAGER: 'finance_manager',
  FIELD_AGENT: 'field_agent',
};

export const ALLOWED_ADMIN_ROLES = [
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
  ROLES.TECH_ADMIN,
  ROLES.AGRI_EXPERT,
  ROLES.ECOMMERCE_MANAGER,
  ROLES.ORDER_MANAGER,
  ROLES.SUPPORT_AGENT,
  ROLES.SUPPORT_MANAGER,
  ROLES.CONTENT_MANAGER,
  ROLES.FINANCE_MANAGER,
  ROLES.FIELD_AGENT,
  'field-officer',
];

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.TECH_ADMIN]: 'Tech Admin',
  [ROLES.AGRI_EXPERT]: 'Agri Expert',
  [ROLES.ECOMMERCE_MANAGER]: 'E-commerce',
  [ROLES.ORDER_MANAGER]: 'Order Manager',
  [ROLES.SUPPORT_AGENT]: 'Support Agent',
  [ROLES.SUPPORT_MANAGER]: 'Support Manager',
  [ROLES.CONTENT_MANAGER]: 'Content',
  [ROLES.FINANCE_MANAGER]: 'Finance',
  [ROLES.FIELD_AGENT]: 'Field Agent',
  'field-officer': 'Field Officer',
  [ROLES.FARMER]: 'Farmer',
};

/**
 * Check if a role has admin access
 */
export const isAdminRole = (role) => ALLOWED_ADMIN_ROLES.includes(role);

/**
 * Get the default redirect path for a given role after login
 */
export const getDefaultRoute = (role) => {
  switch (role) {
    case ROLES.FARMER:
    case 'user':
      return '/farmer/dashboard';
    case ROLES.SUPER_ADMIN:
    case ROLES.TECH_ADMIN:
      return '/super-admin/dashboard';
    case ROLES.SUPPORT_AGENT:
    case ROLES.SUPPORT_MANAGER:
      return '/admin/support';
    case ROLES.FIELD_AGENT:
    case 'field-officer':
      return '/admin/dashboard';
    default:
      return '/admin/dashboard';
  }
};
