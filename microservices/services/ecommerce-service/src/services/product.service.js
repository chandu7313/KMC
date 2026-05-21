import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import productRepo from '../repositories/product.repository.js';

const logger = createLogger('ecommerce-service');

class ProductService {
  async listProducts(filters) {
    try {
      return await productRepo.findAll(filters);
    } catch (err) {
      logger.warn(`listProducts DB failed (${err.message}), returning empty list`, {});
      return [];
    }
  }

  async getProduct(id) {
    const product = await productRepo.findById(id);
    if (!product) throw HttpError.notFound('Product not found');
    return product;
  }

  async addProduct(data) {
    const product = await productRepo.create({
      name: data.name, description: data.description, shortDescription: data.shortDescription,
      category: data.category, subCategory: data.subCategory,
      price: Number(data.price), stock: Number(data.stock),
      images: data.images || [], specifications: data.specifications || {},
      isFeatured: data.isFeatured === 'true' || data.isFeatured === true,
    });
    await publishEvent(EXCHANGES.ECOMMERCE, 'product.created', { productId: product.id, name: product.name }).catch(() => {});
    return product;
  }

  async updateProduct(id, updates) {
    const existing = await productRepo.findById(id);
    if (!existing) throw HttpError.notFound('Product not found');
    return productRepo.update(id, updates);
  }

  async removeProduct(id) {
    const existing = await productRepo.findById(id);
    if (!existing) throw HttpError.notFound('Product not found');
    await productRepo.delete(id);
    return true;
  }
}

export default new ProductService();
