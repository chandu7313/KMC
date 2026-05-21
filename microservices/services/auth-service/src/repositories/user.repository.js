import { models } from '@kissan/shared';

const { User, AdminUser } = models;

/**
 * User repository — abstracts all DB queries for auth service.
 * Refactored to use Sequelize ORM.
 */
class UserRepository {
  async findById(id) {
    return User.findByPk(id, { raw: true });
  }

  async findByEmail(email) {
    return User.findOne({ where: { email }, raw: true });
  }

  async findByPhone(phone) {
    return User.findOne({ where: { phone }, raw: true });
  }

  async create(userData) {
    const user = await User.create(userData);
    return user.get({ plain: true });
  }

  async update(id, updates) {
    const [_, [updatedUser]] = await User.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedUser;
  }

  // ── Admin User queries ──

  async findAdminByEmail(email) {
    return AdminUser.findOne({ where: { email }, raw: true });
  }

  async createAdmin(adminData) {
    const admin = await AdminUser.create(adminData);
    return admin.get({ plain: true });
  }
}

export default new UserRepository();
