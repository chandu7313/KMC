import { models } from '@kissan/shared';

const { MarketplaceOrder, MarketplaceOrderItem, Product, User } = models;

/**
 * Data access repository for MarketplaceOrder and MarketplaceOrderItem models.
 */
class OrderRepository {
  async createOrder(data) {
    const order = await MarketplaceOrder.create(data);
    return order.get({ plain: true });
  }

  async createOrderItems(items) {
    const createdItems = await MarketplaceOrderItem.bulkCreate(items);
    return createdItems.map(item => item.get({ plain: true }));
  }

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

  async update(id, updates) {
    const [_, [updatedOrder]] = await MarketplaceOrder.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedOrder;
  }

  async decrementStock(productId, quantity) {
    const product = await Product.findByPk(productId);
    if (!product) return;
    const newStock = Math.max(0, (product.stock || 0) - quantity);
    await product.update({ stock: newStock });
  }
}

export default new OrderRepository();
