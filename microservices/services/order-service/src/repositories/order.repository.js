import { models } from '@kissan/shared';

const { MarketplaceOrder, MarketplaceOrderItem, Product, User } = models;

/**
 * Data access repository for MarketplaceOrder and MarketplaceOrderItem models.
 */
class OrderRepository {
  /**
   * Create new marketplace order record.
   * @param {object} data - Order header details
   * @returns {Promise<object>} Created plain order record
   */
  async createOrder(data) {
    const order = await MarketplaceOrder.create(data);
    return order.get({ plain: true });
  }

  /**
   * Bulk insert items belonging to an order.
   * @param {Array<object>} items - List of order items
   * @returns {Promise<Array<object>>} Created plain order items
   */
  async createOrderItems(items) {
    const createdItems = await MarketplaceOrderItem.bulkCreate(items);
    return createdItems.map(item => item.get({ plain: true }));
  }

  /**
   * Find order by ID including nested items and product relations.
   * @param {string} id - Order UUID
   * @returns {Promise<object|null>} Order record with products or null
   */
  async findById(id) {
    return MarketplaceOrder.findByPk(id, {
      include: [{
        model: MarketplaceOrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }],
      raw: false // We need false here to let Sequelize build the nested structure
    }).then(result => result ? result.get({ plain: true }) : null);
  }

  /**
   * List orders for a specific user with nested items.
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} List of orders
   */
  async findByUser(userId) {
    return MarketplaceOrder.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      include: [{
        model: MarketplaceOrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }]
    }).then(results => results.map(r => r.get({ plain: true })));
  }

  /**
   * List all marketplace orders with customer details and line items.
   * @returns {Promise<Array>} List of orders
   */
  async findAll() {
    return MarketplaceOrder.findAll({
      order: [['created_at', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['name', 'phone'] },
        {
          model: MarketplaceOrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    }).then(results => results.map(r => r.get({ plain: true })));
  }

  /**
   * Update order fields.
   * @param {string} id - Order UUID
   * @param {object} updates - Updates
   * @returns {Promise<object>} Updated record
   */
  async update(id, updates) {
    const [_, [updatedOrder]] = await MarketplaceOrder.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedOrder;
  }

  /**
   * Decrement stock of product upon order placement.
   * @param {string} productId - Product UUID
   * @param {number} quantity - Quantity purchased
   * @returns {Promise<void>}
   */
  async decrementStock(productId, quantity) {
    const product = await Product.findByPk(productId);
    if (!product) return;
    const newStock = Math.max(0, (product.stock || 0) - quantity);
    await product.update({ stock: newStock });
  }
}

export default new OrderRepository();
