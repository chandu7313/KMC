import { models } from '@kissan/shared';
import { Op } from 'sequelize';

const { Fertilizer } = models;

/**
 * Data access repository for Fertilizer model.
 */
class FertilizerRepository {
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

  async findById(id) {
    return Fertilizer.findByPk(id, { raw: true });
  }

  async create(fertilizer) {
    const fert = await Fertilizer.create(fertilizer);
    return fert.get({ plain: true });
  }

  async update(id, updates) {
    const [_, [updatedFert]] = await Fertilizer.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedFert;
  }

  async delete(id) {
    await Fertilizer.destroy({ where: { id } });
    return true;
  }
}

export default new FertilizerRepository();
