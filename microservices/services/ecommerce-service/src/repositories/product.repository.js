import { models } from '@kissan/shared';
import { Op } from 'sequelize';

const { Product } = models;

/**
 * Data access repository for Product model with pagination and search.
 */
class ProductRepository {
  async findAll({ page = 1, limit = 20, category, sub_category, minPrice, maxPrice, search, sort = 'newest' } = {}) {
    const where = {};
    if (category) where.category = category;
    if (sub_category) where.sub_category = sub_category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const order = [];
    if (sort === 'price_asc') order.push(['price', 'ASC']);
    else if (sort === 'price_desc') order.push(['price', 'DESC']);
    else if (sort === 'rating') order.push(['ratings', 'DESC']);
    else order.push(['created_at', 'DESC']); // newest

    const offset = (page - 1) * limit;

    const { rows, count } = await Product.findAndCountAll({
      where,
      order,
      limit,
      offset,
      raw: true
    });

    return {
      products: rows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / limit)
    };
  }

  async findById(id) {
    return Product.findByPk(id, { raw: true });
  }

  async create(product) {
    const p = await Product.create(product);
    return p.get({ plain: true });
  }

  async update(id, updates) {
    const [_, [updatedProduct]] = await Product.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedProduct;
  }

  async delete(id) {
    await Product.destroy({ where: { id } });
    return true;
  }
}

export default new ProductRepository();
