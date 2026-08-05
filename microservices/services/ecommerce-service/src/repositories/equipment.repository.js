import { models } from '@kissan/shared';
import { Op } from 'sequelize';

const { Equipment } = models;

/**
 * Data access repository for Equipment model.
 */
class EquipmentRepository {
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

  async findById(id) {
    return Equipment.findByPk(id, { raw: true });
  }

  async create(equipment) {
    const eq = await Equipment.create(equipment);
    return eq.get({ plain: true });
  }

  async update(id, updates) {
    const [_, [updatedEq]] = await Equipment.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedEq;
  }

  async delete(id) {
    await Equipment.destroy({ where: { id } });
    return true;
  }
}

export default new EquipmentRepository();
