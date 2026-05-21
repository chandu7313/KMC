import { models } from '@kissan/shared';

const { FertilizerOrder, FertilizerOrderItem, Fertilizer, User } = models;

class FertilizerOrderRepository {
  async createOrder(data) {
    const order = await FertilizerOrder.create(data);
    return order.get({ plain: true });
  }

  async createOrderItems(items) {
    const createdItems = await FertilizerOrderItem.bulkCreate(items);
    return createdItems.map(item => item.get({ plain: true }));
  }

  async findById(id) {
    return FertilizerOrder.findByPk(id, {
      include: [{
        model: FertilizerOrderItem,
        as: 'items',
        include: [{ model: Fertilizer, as: 'fertilizer' }]
      }]
    }).then(result => result ? result.get({ plain: true }) : null);
  }

  async findByUser(userId) {
    return FertilizerOrder.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      include: [{
        model: FertilizerOrderItem,
        as: 'items',
        include: [{ model: Fertilizer, as: 'fertilizer' }]
      }]
    }).then(results => results.map(r => r.get({ plain: true })));
  }

  async findAll() {
    return FertilizerOrder.findAll({
      order: [['created_at', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['name', 'phone'] },
        {
          model: FertilizerOrderItem,
          as: 'items',
          include: [{ model: Fertilizer, as: 'fertilizer' }]
        }
      ]
    }).then(results => results.map(r => r.get({ plain: true })));
  }

  async update(id, updates) {
    const [_, [updatedOrder]] = await FertilizerOrder.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedOrder;
  }

  async decrementStock(fertilizerId, quantity) {
    const fert = await Fertilizer.findByPk(fertilizerId);
    if (!fert) return;
    const newStock = Math.max(0, (fert.stock || 0) - quantity);
    await fert.update({ stock: newStock });
  }
}

export default new FertilizerOrderRepository();
