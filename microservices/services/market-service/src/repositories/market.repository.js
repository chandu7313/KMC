import { models } from '@kissan/shared';
import { Op } from 'sequelize';

const { MarketPrice } = models;

/**
 * Data access repository for MarketPrice models.
 */
class MarketPriceRepository {
  /**
   * Find all market prices with optional crop/district matching.
   * @param {object} [filters={}] - Filter criteria
   * @returns {Promise<Array>} List of market prices
   */
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

  /**
   * Find market price record by ID.
   * @param {string} id - Price record UUID
   * @returns {Promise<object|null>} Plain record or null
   */
  async findById(id) {
    return MarketPrice.findByPk(id, { raw: true });
  }

  /**
   * Create a new market price entry.
   * @param {object} priceData - Price fields
   * @returns {Promise<object>} Created plain record
   */
  async create(priceData) {
    const price = await MarketPrice.create(priceData);
    return price.get({ plain: true });
  }

  /**
   * Update fields on an existing market price entry.
   * @param {string} id - Price record UUID
   * @param {object} updates - Attributes to update
   * @returns {Promise<object>} Updated record
   */
  async update(id, updates) {
    const [_, [updatedPrice]] = await MarketPrice.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedPrice;
  }

  /**
   * Delete a market price record.
   * @param {string} id - Price record UUID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    await MarketPrice.destroy({ where: { id } });
    return true;
  }

  /**
   * List prices for a specific crop sorted by modal price descending.
   * @param {string} crop - Crop name
   * @returns {Promise<Array>}
   */
  async findByCrop(crop) {
    return MarketPrice.findAll({
      where: { cropName: { [Op.iLike]: crop } },
      order: [['modalPrice', 'DESC']],
      raw: true
    });
  }

  /**
   * Find the most recent price record for a given crop and district.
   * @param {string} crop - Crop name
   * @param {string} district - District name
   * @returns {Promise<object|null>}
   */
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

  /**
   * Find price trend entries over the last N days.
   * @param {string} crop - Crop name
   * @param {string} district - District name
   * @param {number} [days=30] - Number of days back
   * @returns {Promise<Array>}
   */
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

  /**
   * Query recent prices for dashboard view.
   * @param {string} [state] - State filter
   * @param {number} [limit=5] - Limit
   * @returns {Promise<Array>}
   */
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
