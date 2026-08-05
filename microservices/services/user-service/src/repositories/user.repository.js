import { models } from '@kissan/shared';
import { Op } from 'sequelize';

const { User } = models;

/**
 * User repository — Sequelize queries for users table.
 */
class UserRepository {
  /**
   * Find user by primary key ID.
   * @param {string} id - User UUID
   * @param {string} [fields=null] - Comma-separated list of attributes to select
   * @returns {Promise<object|null>} Plain user record or null
   */
  async findById(id, fields = null) {
    const options = { raw: true };
    if (fields && fields !== '*') {
      options.attributes = fields.split(',').map(f => f.trim());
    }
    return User.findByPk(id, options);
  }

  /**
   * Find user by unique email.
   * @param {string} email - Email address
   * @returns {Promise<object|null>} Plain user record or null
   */
  async findByEmail(email) {
    return User.findOne({ where: { email }, raw: true });
  }

  /**
   * Find user by mobile phone.
   * @param {string} phone - Phone number
   * @returns {Promise<object|null>} Plain user record or null
   */
  async findByPhone(phone) {
    return User.findOne({ where: { phone }, raw: true });
  }

  /**
   * Update user record attributes.
   * @param {string} id - User UUID
   * @param {object} updates - Attributes to update
   * @returns {Promise<object>} Updated user record
   */
  async update(id, updates) {
    const [_, [updatedUser]] = await User.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedUser;
  }

  /**
   * Delete user by ID.
   * @param {string} id - User UUID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    await User.destroy({ where: { id } });
    return true;
  }

  /**
   * List users with pagination, filters, and search.
   * @param {object} params
   * @param {number} [params.page=1] - Current page number
   * @param {number} [params.limit=20] - Number of items per page
   * @param {string} [params.role] - Filter by role
   * @param {string} [params.search] - Search text for name/email/phone
   * @param {string} [params.district] - Filter by district
   * @param {boolean} [params.isVerified] - Filter by verification status
   * @returns {Promise<{users: Array, pagination: object}>} Paginated users
   */
  async findAll({ page = 1, limit = 20, role, search, district, isVerified } = {}) {
    const where = {};
    if (role) where.role = role;
    if (district) where.district = district;
    if (isVerified !== undefined) where.isAccountVerified = isVerified;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'phone', 'role', 'district', 'crops', 'isAccountVerified', 'created_at'],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      raw: true
    });

    return {
      users: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Get distinct districts for filter dropdowns.
   * @returns {Promise<string[]>} Sorted unique district names
   */
  async getDistinctDistricts() {
    const districts = await User.findAll({
      attributes: ['district'],
      where: {
        role: 'user',
        district: { [Op.not]: null }
      },
      group: ['district'],
      raw: true
    });
    
    const unique = districts.map(d => d.district).filter(Boolean);
    return unique.sort();
  }

  /**
   * Count users by role.
   * @param {string} role - Role name
   * @returns {Promise<number>} User count
   */
  async countByRole(role) {
    return User.count({ where: { role } });
  }
}

export default new UserRepository();
