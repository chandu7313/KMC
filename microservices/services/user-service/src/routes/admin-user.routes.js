import express from 'express';
import { authenticate, authorize, validate } from '@kissan/shared';
import * as adminCtrl from '../controllers/admin-user.controller.js';
import * as userCtrl from '../controllers/user.controller.js';
import { createAdminSchema, updateAdminRoleSchema, changeRoleSchema } from '../validators/user.validator.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(authorize(['user:read']));

// ── User Management (Admin view) ──
// GET  /admin/users          — List all users with filters
router.get('/users', userCtrl.listUsers);

// GET  /admin/districts      — Get distinct districts
router.get('/districts', userCtrl.getDistricts);

// PUT  /admin/users/:id/role — Change user role
router.put('/users/:id/role', authorize(['user:write']), validate(changeRoleSchema), userCtrl.changeUserRole);

// POST /admin/users/:id/deactivate — Deactivate user
router.post('/users/:id/deactivate', authorize(['user:write']), userCtrl.deactivateAccount);

// ── Admin User Management (Super Admin) ──
// GET    /admin/staff           — List admin users
router.get('/staff', authorize(['admin:read']), adminCtrl.listAdminUsers);

// GET    /admin/staff/:id       — Get admin user
router.get('/staff/:id', authorize(['admin:read']), adminCtrl.getAdminUser);

// POST   /admin/staff           — Create admin user
router.post('/staff', authorize(['admin:write']), validate(createAdminSchema), adminCtrl.createAdminUser);

// PUT    /admin/staff/:id/role  — Update admin role
router.put('/staff/:id/role', authorize(['admin:write']), validate(updateAdminRoleSchema), adminCtrl.updateAdminRole);

// POST   /admin/staff/:id/deactivate — Deactivate admin
router.post('/staff/:id/deactivate', authorize(['admin:write']), adminCtrl.deactivateAdmin);

// DELETE /admin/staff/:id       — Delete admin user
router.delete('/staff/:id', authorize(['admin:write']), adminCtrl.deleteAdmin);

export default router;
