import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import productRepo from '../repositories/product.repository.js';

const logger = createLogger('ecommerce-service');

/**
 * Product Catalog Service — handles searching, creating, and updating general agricultural merchandise.
 */
class ProductService {
  /**
   * List catalog products matching filters.
   * @param {object} filters - Filter criteria
   * @returns {Promise<Array>} List of products
   */
  async listProducts(filters) {
    try {
      return await productRepo.findAll(filters);
    } catch (err) {
      logger.warn(`listProducts DB failed (${err.message}), returning empty list`, {});
      return [];
    }
  }

  /**
   * Get single product by ID.
   * @param {string} id - Product UUID
   * @returns {Promise<object>} Product record
   * @throws {HttpError} If not found
   */
  async getProduct(id) {
    const product = await productRepo.findById(id);
    if (!product) throw HttpError.notFound('Product not found');
    return product;
  }

  /**
   * Create new product and publish `product.created` event.
   * @param {object} data - Product details
   * @returns {Promise<object>} Created product record
   */
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

  /**
   * Update existing product.
   * @param {string} id - Product UUID
   * @param {object} updates - Updates
   * @returns {Promise<object>} Updated product
   * @throws {HttpError} If product not found
   */
  async updateProduct(id, updates) {
    const existing = await productRepo.findById(id);
    if (!existing) throw HttpError.notFound('Product not found');
    return productRepo.update(id, updates);
  }

  /**
   * Delete product by ID.
   * @param {string} id - Product UUID
   * @returns {Promise<boolean>} True if deleted
   * @throws {HttpError} If product not found
   */
  async removeProduct(id) {
    const existing = await productRepo.findById(id);
    if (!existing) throw HttpError.notFound('Product not found');
    await productRepo.delete(id);
    return true;
  }
}

export default new ProductService();
