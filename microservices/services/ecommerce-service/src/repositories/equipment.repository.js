import { models } from '@kissan/shared';
import { Op } from 'sequelize';

const { Equipment } = models;

/**
 * Data access repository for Equipment model.
 */
class EquipmentRepository {
  /**
   * List all equipment records matching criteria.
   * @param {object} [filters={}] - Filter criteria
   * @returns {Promise<Array>} List of equipment
   */
  async findAll(filters = {}) {
    const where = {};
    if (filters.category) where.category = filters.category;
    if (filters.search) where.name = { [Op.iLike]: `%${filters.search}%` };

    return Equipment.findAll({
      where,
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

  /**
   * Find equipment by ID.
   * @param {string} id - Equipment UUID
   * @returns {Promise<object|null>} Plain equipment record or null
   */
  async findById(id) {
    return Equipment.findByPk(id, { raw: true });
  }

  /**
   * Create new equipment listing.
   * @param {object} equipment - Equipment data
   * @returns {Promise<object>} Created plain record
   */
  async create(equipment) {
    const eq = await Equipment.create(equipment);
    return eq.get({ plain: true });
  }

  /**
   * Update equipment attributes.
   * @param {string} id - Equipment UUID
   * @param {object} updates - Updates
   * @returns {Promise<object>} Updated record
   */
  async update(id, updates) {
    const [_, [updatedEq]] = await Equipment.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedEq;
  }

  /**
   * Delete equipment by ID.
   * @param {string} id - Equipment UUID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    await Equipment.destroy({ where: { id } });
    return true;
  }
}

export default new EquipmentRepository();
