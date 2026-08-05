import { models } from '@kissan/shared';
import { Op } from 'sequelize';

const { Fertilizer } = models;

/**
 * Data access repository for Fertilizer model.
 */
class FertilizerRepository {
  /**
   * List all fertilizers matching criteria.
   * @param {object} [filters={}] - Filter criteria
   * @returns {Promise<Array>} List of fertilizers
   */
  async findAll(filters = {}) {
    const where = {};
    if (filters.category) where.category = filters.category;
    if (filters.search) where.name = { [Op.iLike]: `%${filters.search}%` };

    return Fertilizer.findAll({
      where,
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

  /**
   * Find fertilizer by ID.
   * @param {string} id - Fertilizer UUID
   * @returns {Promise<object|null>} Plain fertilizer record or null
   */
  async findById(id) {
    return Fertilizer.findByPk(id, { raw: true });
  }

  /**
   * Create new fertilizer record.
   * @param {object} fertilizer - Fertilizer data
   * @returns {Promise<object>} Created plain record
   */
  async create(fertilizer) {
    const fert = await Fertilizer.create(fertilizer);
    return fert.get({ plain: true });
  }

  /**
   * Update fertilizer attributes.
   * @param {string} id - Fertilizer UUID
   * @param {object} updates - Updates
   * @returns {Promise<object>} Updated record
   */
  async update(id, updates) {
    const [_, [updatedFert]] = await Fertilizer.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedFert;
  }

  /**
   * Delete fertilizer by ID.
   * @param {string} id - Fertilizer UUID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    await Fertilizer.destroy({ where: { id } });
    return true;
  }
}

export default new FertilizerRepository();
