/**
 * Auth Feature — Public API
 * Only export what other features are allowed to import.
 */

// Context & Hook
export { AuthContext, AuthProvider } from './context/AuthContext';
export { default as useAuth } from './hooks/useAuth';

// Guards
export { default as ProtectedRoute } from './guards/ProtectedRoute';
export { default as RoleGuard } from './guards/RoleGuard';

// API (for use by other features that need auth calls)
export * as authApi from './api/auth.api';

// Utils
export { getLocalPreferences, clearAuthStorage } from './utils/tokenStorage';
