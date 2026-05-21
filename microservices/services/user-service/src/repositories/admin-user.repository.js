import { models } from '@kissan/shared';

const { AdminUser } = models;

/**
 * Admin user repository — Sequelize queries for admin_users table.
 */
class AdminUserRepository {
  async findById(id) {
    return AdminUser.findByPk(id, { raw: true });
  }

  async findByEmail(email) {
    return AdminUser.findOne({ where: { email }, raw: true });
  }

  async create(adminData) {
    const admin = await AdminUser.create(adminData);
    return admin.get({ plain: true });
  }

  async update(id, updates) {
    const [_, [updatedAdmin]] = await AdminUser.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedAdmin;
  }

  async delete(id) {
    await AdminUser.destroy({ where: { id } });
    return true;
  }

  async findAll({ page = 1, limit = 20, role, status } = {}) {
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { rows, count } = await AdminUser.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'role', 'status', 'created_at'],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      raw: true
    });

    return {
      admins: rows,
      pagination: {
        page, limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}

export default new AdminUserRepository();
