import { models } from '@kissan/shared';
import { Op } from 'sequelize';

const { MarketPrice } = models;

class MarketPriceRepository {
  async findAll({ crop, district } = {}) {
    const where = {};
    if (crop) where.cropName = { [Op.iLike]: `%${crop}%` };
    if (district) where.district = { [Op.iLike]: `%${district}%` };

    return MarketPrice.findAll({
      where,
      order: [['arrivalDate', 'DESC']],
      raw: true
    });
  }

  async findById(id) {
    return MarketPrice.findByPk(id, { raw: true });
  }

  async create(priceData) {
    const price = await MarketPrice.create(priceData);
    return price.get({ plain: true });
  }

  async update(id, updates) {
    const [_, [updatedPrice]] = await MarketPrice.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedPrice;
  }

  async delete(id) {
    await MarketPrice.destroy({ where: { id } });
    return true;
  }

  async findByCrop(crop) {
    return MarketPrice.findAll({
      where: { cropName: { [Op.iLike]: crop } },
      order: [['modalPrice', 'DESC']],
      raw: true
    });
  }

  async findLatest(crop, district) {
    return MarketPrice.findOne({
      where: {
        cropName: { [Op.iLike]: `%${crop}%` },
        district: { [Op.iLike]: `%${district}%` }
      },
      order: [['arrivalDate', 'DESC']],
      raw: true
    });
  }

  async findTrend(crop, district, days = 30) {
    const since = new Date(); 
    since.setDate(since.getDate() - days);

    return MarketPrice.findAll({
      where: {
        cropName: { [Op.iLike]: `%${crop}%` },
        district: { [Op.iLike]: `%${district}%` },
        arrivalDate: { [Op.gte]: since }
      },
      order: [['arrivalDate', 'ASC']],
      raw: true
    });
  }

  async findDashboardPrices(state, limit = 5) {
    const where = {};
    if (state) where.state = { [Op.iLike]: `%${state}%` };
    
    return MarketPrice.findAll({
      where,
      order: [['arrivalDate', 'DESC']],
      limit: parseInt(limit, 10),
      raw: true
    });
  }
}

export default new MarketPriceRepository();
