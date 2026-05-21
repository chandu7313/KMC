import { models } from '@kissan/shared';

const { EquipmentOrder, EquipmentOrderItem, Equipment, User } = models;

class EquipmentOrderRepository {
  async createOrder(data) {
    const order = await EquipmentOrder.create(data);
    return order.get({ plain: true });
  }

  async createOrderItems(items) {
    const createdItems = await EquipmentOrderItem.bulkCreate(items);
    return createdItems.map(item => item.get({ plain: true }));
  }

  async findById(id) {
    return EquipmentOrder.findByPk(id, {
      include: [{
        model: EquipmentOrderItem,
        as: 'items',
        include: [{ model: Equipment, as: 'equipment' }]
      }]
    }).then(result => result ? result.get({ plain: true }) : null);
  }

  async findByUser(userId) {
    return EquipmentOrder.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      include: [{
        model: EquipmentOrderItem,
        as: 'items',
        include: [{ model: Equipment, as: 'equipment' }]
      }]
    }).then(results => results.map(r => r.get({ plain: true })));
  }

  async findAll() {
    return EquipmentOrder.findAll({
      order: [['created_at', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['name', 'phone'] },
        {
          model: EquipmentOrderItem,
          as: 'items',
          include: [{ model: Equipment, as: 'equipment' }]
        }
      ]
    }).then(results => results.map(r => r.get({ plain: true })));
  }

  async update(id, updates) {
    const [_, [updatedOrder]] = await EquipmentOrder.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedOrder;
  }

  async decrementStock(equipmentId, quantity) {
    const eq = await Equipment.findByPk(equipmentId);
    if (!eq) return;
    const newStock = Math.max(0, (eq.stock || 0) - quantity);
    await eq.update({ stock: newStock });
  }
}

export default new EquipmentOrderRepository();
