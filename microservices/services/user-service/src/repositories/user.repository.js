import { models } from '@kissan/shared';
import { Op } from 'sequelize';

const { User } = models;

/**
 * User repository — Sequelize queries for users table.
 */
class UserRepository {
  async findById(id, fields = null) {
    const options = { raw: true };
    if (fields && fields !== '*') {
      options.attributes = fields.split(',').map(f => f.trim());
    }
    return User.findByPk(id, options);
  }

  async findByEmail(email) {
    return User.findOne({ where: { email }, raw: true });
  }

  async findByPhone(phone) {
    return User.findOne({ where: { phone }, raw: true });
  }

  async update(id, updates) {
    const [_, [updatedUser]] = await User.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedUser;
  }

  async delete(id) {
    await User.destroy({ where: { id } });
    return true;
  }

  /**
   * List users with pagination, filters, and search.
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
   */
  async countByRole(role) {
    return User.count({ where: { role } });
  }
}

export default new UserRepository();
