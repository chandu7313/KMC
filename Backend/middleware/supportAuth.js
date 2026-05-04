import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/index.js';

// ─────────────────────────────────────────────────────────────
// Support Portal Auth Middleware
// Verifies JWT and checks admin_users role for support access
// ─────────────────────────────────────────────────────────────

/**
 * Base support auth — allows super_admin, support_agent, support_manager
 */
const supportAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenDecode.id) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        // First check admin_users table for support staff
        let adminUser = await AdminUser.findByPk(tokenDecode.id, {
            attributes: ['id', 'role', 'status', 'isActive']
        });

        if (adminUser) {
            if (!adminUser.isActive) {
                return res.status(403).json({ success: false, message: 'Account deactivated. Contact administrator.' });
            }

            const allowedRoles = ['super_admin', 'support_agent', 'support_manager'];
            if (!allowedRoles.includes(adminUser.role)) {
                return res.status(403).json({ success: false, message: 'Not Authorized. Support Access Required' });
            }

            req.userId = tokenDecode.id;
            req.userRole = adminUser.role;
            req.isAdminUser = true;
            return next();
        }

        // Fallback: check main users table for admin role (backward compatibility)
        const { User } = await import('../models/index.js');
        const user = await User.findByPk(tokenDecode.id, {
            attributes: ['id', 'role']
        });

        if (user && user.role === 'admin') {
            req.userId = tokenDecode.id;
            req.userRole = 'super_admin'; // Treat existing admins as super_admin
            req.isAdminUser = false;
            return next();
        }

        return res.status(403).json({ success: false, message: 'Not Authorized. Support Access Required' });

    } catch (error) {
        console.error('Support auth error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Manager-level auth — allows super_admin, support_manager only
 */
const managerAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenDecode.id) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        let adminUser = await AdminUser.findByPk(tokenDecode.id, {
            attributes: ['id', 'role', 'isActive']
        });

        if (adminUser) {
            if (!adminUser.isActive) {
                return res.status(403).json({ success: false, message: 'Account deactivated.' });
            }

            const allowedRoles = ['super_admin', 'support_manager'];
            if (!allowedRoles.includes(adminUser.role)) {
                return res.status(403).json({ success: false, message: 'Manager or Admin access required' });
            }

            req.userId = tokenDecode.id;
            req.userRole = adminUser.role;
            req.isAdminUser = true;
            return next();
        }

        // Fallback for existing admins
        const { User } = await import('../models/index.js');
        const user = await User.findByPk(tokenDecode.id, {
            attributes: ['id', 'role']
        });

        if (user && user.role === 'admin') {
            req.userId = tokenDecode.id;
            req.userRole = 'super_admin';
            req.isAdminUser = false;
            return next();
        }

        return res.status(403).json({ success: false, message: 'Manager or Admin access required' });

    } catch (error) {
        console.error('Manager auth error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Super admin only — allows super_admin only
 */
const superAdminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenDecode.id) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        let adminUser = await AdminUser.findByPk(tokenDecode.id, {
            attributes: ['id', 'role', 'isActive']
        });

        if (adminUser) {
            if (!adminUser.isActive) {
                return res.status(403).json({ success: false, message: 'Account deactivated.' });
            }

            if (adminUser.role !== 'super_admin') {
                return res.status(403).json({ success: false, message: 'Super Admin access required' });
            }

            req.userId = tokenDecode.id;
            req.userRole = 'super_admin';
            req.isAdminUser = true;
            return next();
        }

        // Fallback for existing admins
        const { User } = await import('../models/index.js');
        const user = await User.findByPk(tokenDecode.id, {
            attributes: ['id', 'role']
        });

        if (user && user.role === 'admin') {
            req.userId = tokenDecode.id;
            req.userRole = 'super_admin';
            req.isAdminUser = false;
            return next();
        }

        return res.status(403).json({ success: false, message: 'Super Admin access required' });

    } catch (error) {
        console.error('Super admin auth error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { supportAuth, managerAuth, superAdminAuth };
