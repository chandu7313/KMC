import bcrypt from 'bcryptjs';
import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES, USER_EVENTS } from '@kissan/events';
import adminUserRepository from '../repositories/admin-user.repository.js';
import env from '../config/env.js';

const logger = createLogger('user-service');

class AdminUserService {
  // ── List Admin Users ──

  async listAdminUsers(filters) {
    return adminUserRepository.findAll(filters);
  }

  // ── Get Admin by ID ──

  async getAdminUser(id) {
    const admin = await adminUserRepository.findById(id);
    if (!admin) throw HttpError.notFound('Admin user not found');
    return admin;
  }

  // ── Create Admin User ──

  async createAdminUser({ name, email, password, role }) {
    const existing = await adminUserRepository.findByEmail(email);
    if (existing) {
      throw HttpError.conflict('Admin user with this email already exists');
    }

    const validRoles = [
      'admin', 'tech_admin', 'agri_expert', 'ecommerce_manager',
      'order_manager', 'support_agent', 'support_manager',
      'content_manager', 'finance_manager', 'field_agent',
    ];

    if (!validRoles.includes(role)) {
      throw HttpError.badRequest(`Invalid role. Allowed: ${validRoles.join(', ')}`);
    }

    const hashedPassword = await bcrypt.hash(password, env.bcryptRounds);
    const admin = await adminUserRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: 'online',
    });

    logger.info(`Admin user created: ${admin.id}`, { email, role });

    return admin;
  }

  // ── Update Admin Role ──

  async updateAdminRole(id, newRole) {
    const admin = await adminUserRepository.findById(id);
    if (!admin) throw HttpError.notFound('Admin user not found');

    const updated = await adminUserRepository.update(id, { role: newRole });

    await publishEvent(EXCHANGES.USER, USER_EVENTS.ROLE_CHANGED, {
      userId: id,
      previousRole: admin.role,
      newRole,
      isAdmin: true,
    });

    return updated;
  }

  // ── Deactivate Admin ──

  async deactivateAdmin(id) {
    const admin = await adminUserRepository.findById(id);
    if (!admin) throw HttpError.notFound('Admin user not found');

    const updated = await adminUserRepository.update(id, { status: 'offline' });

    await publishEvent(EXCHANGES.USER, USER_EVENTS.ACCOUNT_DEACTIVATED, {
      userId: id,
      isAdmin: true,
    });

    return updated;
  }

  // ── Delete Admin ──

  async deleteAdmin(id) {
    const admin = await adminUserRepository.findById(id);
    if (!admin) throw HttpError.notFound('Admin user not found');

    await adminUserRepository.delete(id);
    logger.info(`Admin user deleted: ${id}`);
    return true;
  }
}

export default new AdminUserService();
