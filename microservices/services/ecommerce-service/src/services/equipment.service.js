import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import equipmentRepo from '../repositories/equipment.repository.js';

const logger = createLogger('ecommerce-service');

/**
 * Agricultural Equipment & Machinery Service — manages tools, implements, specifications, and availability.
 */
class EquipmentService {
  async listEquipments(filters) {
    try {
      return await equipmentRepo.findAll(filters);
    } catch (err) {
      logger.warn(`listEquipments DB failed (${err.message}), returning empty list`, {});
      return [];
    }
  }

  async getEquipment(id) {
    const equipment = await equipmentRepo.findById(id);
    if (!equipment) throw HttpError.notFound('Equipment not found');
    return equipment;
  }

  async addEquipment(data) {
    let specifications = {};
    if (data.specifications) {
      try {
        specifications = typeof data.specifications === 'string'
          ? JSON.parse(data.specifications)
          : data.specifications;
        if (typeof specifications !== 'object' || specifications === null) specifications = {};
      } catch (e) {
        specifications = {};
      }
    }

    const equipment = await equipmentRepo.create({
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      stock: Number(data.stock),
      image: data.image,
      specifications,
    });
    await publishEvent(EXCHANGES.ECOMMERCE, 'product.created', {
      productId: equipment.id, name: equipment.name, type: 'equipment',
    }).catch(() => {});
    return equipment;
  }

  async updateEquipment(id, data) {
    const existing = await equipmentRepo.findById(id);
    if (!existing) throw HttpError.notFound('Equipment not found');

    const updates = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.price !== undefined) updates.price = Number(data.price);
    if (data.category !== undefined) updates.category = data.category;
    if (data.stock !== undefined) updates.stock = Number(data.stock);
    if (data.image !== undefined) updates.image = data.image;
    if (data.specifications !== undefined) {
      try {
        updates.specifications = typeof data.specifications === 'string'
          ? JSON.parse(data.specifications)
          : data.specifications;
        if (typeof updates.specifications !== 'object' || updates.specifications === null) {
          updates.specifications = {};
        }
      } catch (e) {
        updates.specifications = {};
      }
    }

    return equipmentRepo.update(id, updates);
  }

  async removeEquipment(id) {
    const existing = await equipmentRepo.findById(id);
    if (!existing) throw HttpError.notFound('Equipment not found');
    await equipmentRepo.delete(id);
    return true;
  }
}

export default new EquipmentService();
