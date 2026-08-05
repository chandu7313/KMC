import NodeCache from 'node-cache';
import { HttpError, createLogger } from '@kissan/shared';
import marketRepo from '../repositories/market.repository.js';

const logger = createLogger('market-service');
const cache = new NodeCache({ stdTTL: 300 }); // 5-min cache

/**
 * Business service for mandi prices, in-memory caching, trends, and buy/sell advisories.
 */
class MarketService {
  /**
   * Fetch market prices with 5-minute in-memory caching.
   * @param {object} filters - Search filters (crop, district)
   * @returns {Promise<Array>} List of market prices
   */
  async getPrices(filters) {
    const key = `prices:${filters.crop || ''}:${filters.district || ''}`;
    const cached = cache.get(key);
    if (cached) return cached;
    const prices = await marketRepo.findAll(filters);
    cache.set(key, prices);
    return prices;
  }

  /**
   * Fetch dashboard prices for given state and limit.
   * @param {string} state - State name
   * @param {number} [limit=5] - Number of records
   * @returns {Promise<Array>}
   */
  async getDashboardPrices(state, limit = 5) {
    const key = `dashboard_prices:${state || 'all'}:${limit}`;
    const cached = cache.get(key);
    if (cached) return cached;
    
    const prices = await marketRepo.findDashboardPrices(state, limit);
    cache.set(key, prices);
    return prices;
  }

  /**
   * Add a new mandi price entry and invalidate cache.
   * @param {object} data - Price record fields
   * @returns {Promise<object>} Created price record
   */
  async addPrice(data) {
    const price = await marketRepo.create({
      cropName: data.cropName, variety: data.variety, district: data.district,
      mandi: data.mandi, modalPrice: data.price || data.modalPrice,
      minPrice: data.minPrice, maxPrice: data.maxPrice,
      arrivalDate: data.arrivalDate || new Date().toISOString(),
    });
    this._clearCache(data.cropName);
    return price;
  }

  /**
   * Update existing mandi price entry.
   * @param {string} id - Price record UUID
   * @param {object} updates - Updates
   * @returns {Promise<object>} Updated record
   * @throws {HttpError} If record not found
   */
  async updatePrice(id, updates) {
    const existing = await marketRepo.findById(id);
    if (!existing) throw HttpError.notFound('Market price not found');
    const allowed = ['cropName','variety','district','mandi','minPrice','maxPrice','modalPrice','arrivalDate'];
    const filtered = {};
    allowed.forEach(k => { if (updates[k] !== undefined) filtered[k] = updates[k]; });
    const updated = await marketRepo.update(id, filtered);
    this._clearCache(existing.cropName);
    return updated;
  }

  /**
   * Delete mandi price entry.
   * @param {string} id - Price record UUID
   * @returns {Promise<boolean>} True if deleted
   * @throws {HttpError} If record not found
   */
  async deletePrice(id) {
    const existing = await marketRepo.findById(id);
    if (!existing) throw HttpError.notFound('Market price not found');
    await marketRepo.delete(id);
    this._clearCache(existing.cropName);
    return true;
  }

  /**
   * Retrieve prices across all mandis for comparison.
   * @param {string} crop - Crop name
   * @returns {Promise<Array>}
   */
  async getCropComparison(crop) { return marketRepo.findByCrop(crop); }

  /**
   * Retrieve latest recorded real-time price.
   * @param {string} crop - Crop name
   * @param {string} district - District name
   * @returns {Promise<object>}
   * @throws {HttpError} If parameters missing or no price record found
   */
  async getRealTimePrice(crop, district) {
    if (!crop || !district) throw HttpError.badRequest('crop and district are required');
    const data = await marketRepo.findLatest(crop, district);
    if (!data) throw HttpError.notFound('No real-time data found');
    return data;
  }

  /**
   * Calculate 30-day historical trend, average, and price volatility.
   * @param {string} crop - Crop name
   * @param {string} district - District name
   * @returns {Promise<object>} Trend statistics
   */
  async getTrend(crop, district) {
    if (!crop || !district) throw HttpError.badRequest('crop and district are required');
    const history = await marketRepo.findTrend(crop, district, 30);
    if (!history.length) return { success: false, message: 'No trend data' };
    const prices = history.map(h => h.modalPrice);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const latest = prices[prices.length - 1];
    const oldest = prices[0];
    const change = oldest ? ((latest - oldest) / oldest * 100).toFixed(1) : 0;
    return { success: true, history, avgPrice: Math.round(avg), latestPrice: latest, priceChange: parseFloat(change), trend: change > 5 ? 'rising' : change < -5 ? 'falling' : 'stable' };
  }

  /**
   * Generate buy / sell recommendation from price trajectory.
   * @param {string} crop - Crop name
   * @param {string} district - District name
   * @returns {Promise<object>} Recommendation object
   */
  async getRecommendation(crop, district) {
    const trend = await this.getTrend(crop, district);
    if (!trend.success) return { advice: 'Not enough data', action: 'hold' };
    if (trend.trend === 'rising') return { advice: `${crop} prices are rising in ${district}. Good time to sell.`, action: 'sell', ...trend };
    if (trend.trend === 'falling') return { advice: `${crop} prices are falling. Consider holding for better rates.`, action: 'hold', ...trend };
    return { advice: `${crop} prices are stable in ${district}.`, action: 'hold', ...trend };
  }

  /**
   * Invalidate cached market prices for given crop.
   * @param {string} crop - Crop name
   * @private
   */
  _clearCache(crop) { cache.keys().filter(k => k.includes(crop) || k === 'prices::').forEach(k => cache.del(k)); }
}

export default new MarketService();
