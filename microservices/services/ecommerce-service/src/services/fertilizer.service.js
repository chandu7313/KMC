import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import fertilizerRepo from '../repositories/fertilizer.repository.js';

const logger = createLogger('ecommerce-service');

/**
 * Fertilizer Management Service — handles catalog operations for organic and chemical fertilizers.
 */
class FertilizerService {
  /**
   * List fertilizers matching query filters.
   * @param {object} filters - Filter criteria
   * @returns {Promise<Array>} List of fertilizers
   */
  async listFertilizers(filters) {
    try {
      return await fertilizerRepo.findAll(filters);
    } catch (err) {
      logger.warn(`listFertilizers DB failed (${err.message}), returning empty list`, {});
      return [];
    }
  }

  /**
   * Get fertilizer by ID.
   * @param {string} id - Fertilizer UUID
   * @returns {Promise<object>} Fertilizer record
   * @throws {HttpError} If not found
   */
  async getFertilizer(id) {
    const fertilizer = await fertilizerRepo.findById(id);
    if (!fertilizer) throw HttpError.notFound('Fertilizer not found');
    return fertilizer;
  }

  /**
   * Add a new fertilizer to catalog and publish event.
   * @param {object} data - Fertilizer properties
   * @returns {Promise<object>} Created fertilizer record
   */
  async addFertilizer(data) {
    const fertilizer = await fertilizerRepo.create({
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      stock: Number(data.stock),
      image: data.image,
    });
    await publishEvent(EXCHANGES.ECOMMERCE, 'product.created', {
      productId: fertilizer.id, name: fertilizer.name, type: 'fertilizer',
    }).catch(() => {});
    return fertilizer;
  }

  /**
   * Update existing fertilizer attributes.
   * @param {string} id - Fertilizer UUID
   * @param {object} data - Updates
   * @returns {Promise<object>} Updated record
   * @throws {HttpError} If not found
   */
  async updateFertilizer(id, data) {
    const existing = await fertilizerRepo.findById(id);
    if (!existing) throw HttpError.notFound('Fertilizer not found');

    const updates = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.price !== undefined) updates.price = Number(data.price);
    if (data.category !== undefined) updates.category = data.category;
    if (data.stock !== undefined) updates.stock = Number(data.stock);
    if (data.image !== undefined) updates.image = data.image;

    return fertilizerRepo.update(id, updates);
  }

  /**
   * Delete fertilizer by ID.
   * @param {string} id - Fertilizer UUID
   * @returns {Promise<boolean>} True if deleted
   * @throws {HttpError} If not found
   */
  async removeFertilizer(id) {
    const existing = await fertilizerRepo.findById(id);
    if (!existing) throw HttpError.notFound('Fertilizer not found');
    await fertilizerRepo.delete(id);
    return true;
  }
}

export default new FertilizerService();
