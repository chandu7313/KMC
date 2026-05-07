import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import fertilizerRepo from '../repositories/fertilizer.repository.js';

const logger = createLogger('ecommerce-service');

class FertilizerService {
  async listFertilizers(filters) {
    return fertilizerRepo.findAll(filters);
  }

  async getFertilizer(id) {
    const fertilizer = await fertilizerRepo.findById(id);
    if (!fertilizer) throw HttpError.notFound('Fertilizer not found');
    return fertilizer;
  }

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

  async removeFertilizer(id) {
    const existing = await fertilizerRepo.findById(id);
    if (!existing) throw HttpError.notFound('Fertilizer not found');
    await fertilizerRepo.delete(id);
    return true;
  }
}

export default new FertilizerService();
