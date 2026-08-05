import { models } from '@kissan/shared';

const { User, AdminUser } = models;

/**
 * User repository — abstracts all DB queries for auth service.
 * Refactored to use Sequelize ORM.
 */
class UserRepository {
  /**
   * Find user by primary key ID.
   * @param {string} id - User UUID
   * @returns {Promise<object|null>} Plain user object or null
   */
  async findById(id) {
    return User.findByPk(id, { raw: true });
  }

  /**
   * Find user by email address.
   * @param {string} email - Email address
   * @returns {Promise<object|null>} Plain user object or null
   */
  async findByEmail(email) {
    return User.findOne({ where: { email }, raw: true });
  }

  /**
   * Find user by phone number.
   * @param {string} phone - Mobile phone number
   * @returns {Promise<object|null>} Plain user object or null
   */
  async findByPhone(phone) {
    return User.findOne({ where: { phone }, raw: true });
  }

  /**
   * Create a new user record in database.
   * @param {object} userData - User record attributes
   * @returns {Promise<object>} Created user plain object
   */
  async create(userData) {
    const user = await User.create(userData);
    return user.get({ plain: true });
  }

  /**
   * Update existing user by ID.
   * @param {string} id - User UUID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} Updated user plain object
   */
  async update(id, updates) {
    const [_, [updatedUser]] = await User.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedUser;
  }

  // ── Admin User queries ──

  /**
   * Find admin user by email address.
   * @param {string} email - Admin email
   * @returns {Promise<object|null>} Admin record or null
   */
  async findAdminByEmail(email) {
    return AdminUser.findOne({ where: { email }, raw: true });
  }

  /**
   * Find active admin user by role.
   * @param {string} role - Admin role name
   * @returns {Promise<object|null>} Admin record or null
   */
  async findAdminByRole(role) {
    return AdminUser.findOne({
      where: { role, isActive: true },
      raw: true,
    });
  }

  /**
   * Find admin user by ID.
   * @param {string} id - Admin UUID
   * @returns {Promise<object|null>} Admin record or null
   */
  async findAdminById(id) {
    return AdminUser.findByPk(id, { raw: true });
  }

  /**
   * Create a new admin user record.
   * @param {object} adminData - Admin record attributes
   * @returns {Promise<object>} Created admin plain object
   */
  async createAdmin(adminData) {
    const admin = await AdminUser.create(adminData);
    return admin.get({ plain: true });
  }

  /**
   * Update admin user record.
   * @param {string} id - Admin UUID
   * @param {object} updates - Attributes to update
   * @returns {Promise<object>} Updated admin plain object
   */
  async updateAdmin(id, updates) {
    const [_, [updatedAdmin]] = await AdminUser.update(updates, {
      where: { id },
      returning: true,
      raw: true,
    });
    return updatedAdmin;
  }
}

export default new UserRepository();
