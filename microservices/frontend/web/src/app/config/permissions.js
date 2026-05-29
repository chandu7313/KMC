/**
 * Frontend RBAC Configuration
 * Single source of truth for role definitions and permissions.
 * Extracted from the hardcoded arrays scattered across AdminLayout, Login, etc.
 */

export const ROLES = {
  FARMER: 'farmer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  TECH_ADMIN: 'tech_admin',
  AGRI_EXPERT: 'agri_expert',
  ECOMMERCE_MANAGER: 'ecommerce_manager',
  ORDER_MANAGER: 'order_manager',
  SUPPORT_AGENT: 'support_agent',
  SUPPORT_MANAGER: 'support_manager',
  CONTENT_MANAGER: 'content_manager',
  FINANCE_MANAGER: 'finance_manager',
  FIELD_AGENT: 'field_agent',
  FIELD_OFFICER: 'field_officer',
};

// ─── Role → Dashboard path mapping ────────────────────────
export const ROLE_DASHBOARDS = {
  farmer: '/farmer/dashboard',
  user: '/farmer/dashboard',
  admin: '/admin/dashboard',
  super_admin: '/admin/dashboard',
  tech_admin: '/admin/tech',
  agri_expert: '/admin/agri',
  ecommerce_manager: '/admin/ecommerce',
  order_manager: '/admin/orders',
  support_agent: '/admin/support',
  support_manager: '/admin/support',
  content_manager: '/admin/content',
  finance_manager: '/admin/finance',
  field_agent: '/admin/field',
  field_officer: '/admin/field',
};

// ─── Display labels ───────────────────────────────────────
export const ROLE_LABELS = {
  farmer: 'Farmer',
  admin: 'Admin',
  super_admin: 'Super Admin',
  tech_admin: 'Tech Admin',
  agri_expert: 'Agri Expert',
  ecommerce_manager: 'E-Commerce',
  order_manager: 'Order Manager',
  support_agent: 'Support Agent',
  support_manager: 'Support Manager',
  content_manager: 'Content Manager',
  finance_manager: 'Finance Manager',
  field_agent: 'Field Agent',
  field_officer: 'Field Officer',
};

// ─── Role icons ───────────────────────────────────────────
export const ROLE_ICONS = {
  farmer: '👨‍🌾',
  admin: '👔',
  super_admin: '👑',
  tech_admin: '⚙️',
  agri_expert: '🌿',
  ecommerce_manager: '🛒',
  order_manager: '📦',
  support_agent: '🎧',
  support_manager: '🎧',
  content_manager: '✍️',
  finance_manager: '💰',
  field_agent: '🚜',
  field_officer: '🚜',
};

// ─── Role-specific Tailwind color tokens ──────────────────
export const ROLE_COLORS = {
  farmer: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
  admin: { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-700' },
  super_admin: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700' },
  tech_admin: { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700' },
  agri_expert: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700' },
  ecommerce_manager: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  order_manager: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700' },
  support_agent: { bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-700' },
  support_manager: { bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-700' },
  content_manager: { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-700' },
  finance_manager: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700' },
  field_agent: { bg: 'bg-lime-50', border: 'border-lime-300', text: 'text-lime-700' },
  field_officer: { bg: 'bg-lime-50', border: 'border-lime-300', text: 'text-lime-700' },
};

// ─── Dev accounts for quick login (dev mode only) ─────────
export const DEV_ACCOUNTS = [
  {
    role: 'farmer',
    label: 'Farmer',
    email: null,
    phone: '9876543210',
    userType: 'farmer',
  },
  {
    role: 'field_officer',
    label: 'Field Officer',
    email: 'fieldofficer@dev.kissanmithar.com',
    password: 'Dev@FieldOfficer123',
    userType: 'admin',
  },
  {
    role: 'super_admin',
    label: 'Super Admin',
    email: 'superadmin@dev.kissanmithar.com',
    password: 'Dev@SuperAdmin123',
    userType: 'admin',
  },
  {
    role: 'admin',
    label: 'Admin',
    email: 'admin@dev.kissanmithar.com',
    password: 'Dev@Admin123',
    userType: 'admin',
  },
  {
    role: 'tech_admin',
    label: 'Tech Admin',
    email: 'techadmin@dev.kissanmithar.com',
    password: 'Dev@TechAdmin123',
    userType: 'admin',
  },
  {
    role: 'agri_expert',
    label: 'Agri Expert',
    email: 'agriexpert@dev.kissanmithar.com',
    password: 'Dev@AgriExpert123',
    userType: 'admin',
  },
  {
    role: 'ecommerce_manager',
    label: 'E-commerce',
    email: 'ecommerce@dev.kissanmithar.com',
    password: 'Dev@Ecommerce123',
    userType: 'admin',
  },
  {
    role: 'order_manager',
    label: 'Order Manager',
    email: 'orders@dev.kissanmithar.com',
    password: 'Dev@Orders123',
    userType: 'admin',
  },
  {
    role: 'support_agent',
    label: 'Support Agent',
    email: 'supportagent@dev.kissanmithar.com',
    password: 'Dev@SupportAgent123',
    userType: 'admin',
  },
  {
    role: 'support_manager',
    label: 'Support Manager',
    email: 'supportmanager@dev.kissanmithar.com',
    password: 'Dev@SupportManager123',
    userType: 'admin',
  },
  {
    role: 'content_manager',
    label: 'Content Manager',
    email: 'content@dev.kissanmithar.com',
    password: 'Dev@Content123',
    userType: 'admin',
  },
  {
    role: 'finance_manager',
    label: 'Finance Manager',
    email: 'finance@dev.kissanmithar.com',
    password: 'Dev@Finance123',
    userType: 'admin',
  },
  {
    role: 'field_agent',
    label: 'Field Agent',
    email: 'fieldagent@dev.kissanmithar.com',
    password: 'Dev@FieldAgent123',
    userType: 'admin',
  },
];

// ─── All admin roles (non-farmer) ─────────────────────────
export const ADMIN_ROLES = [
  'admin',
  'super_admin',
  'tech_admin',
  'agri_expert',
  'ecommerce_manager',
  'order_manager',
  'support_agent',
  'support_manager',
  'content_manager',
  'finance_manager',
  'field_agent',
  'field_officer',
];

export const ALLOWED_ADMIN_ROLES = ADMIN_ROLES;

/**
 * Check if a role has admin access
 */
export const isAdminRole = (role) => ADMIN_ROLES.includes(role);

/**
 * Get the default redirect path for a given role after login
 */
export const getDefaultRoute = (role) => {
  return ROLE_DASHBOARDS[role] || '/admin/dashboard';
};
