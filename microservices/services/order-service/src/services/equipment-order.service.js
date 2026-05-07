import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import equipmentOrderRepo from '../repositories/equipment-order.repository.js';

const logger = createLogger('order-service');

class EquipmentOrderService {
  /** Place an equipment order */
  async placeOrder(userId, body) {
    const { items, totalAmount, address } = body;
    if (!items?.length || !totalAmount || !address) {
      throw HttpError.badRequest('items, totalAmount, and address are required');
    }

    const order = await equipmentOrderRepo.createOrder({
      userId,
      totalAmount: Number(totalAmount),
      address,
      status: 'Pending',
    });

    const orderItems = items.map(item => ({
      orderId: order.id,
      equipmentId: item.equipmentId,
      quantity: item.quantity,
      price: item.price,
    }));
    await equipmentOrderRepo.createOrderItems(orderItems);

    // Decrement stock for each item
    for (const item of items) {
      await equipmentOrderRepo.decrementStock(item.equipmentId, item.quantity);
    }

    await publishEvent(EXCHANGES.ORDERS, 'order.created', {
      orderId: order.id, userId, amount: totalAmount, type: 'equipment',
    }).catch(() => {});

    return order;
  }

  /** Get orders for a specific user */
  async userOrders(userId) {
    return equipmentOrderRepo.findByUser(userId);
  }

  /** Admin: get all equipment orders */
  async adminOrders() {
    return equipmentOrderRepo.findAll();
  }

  /** Admin: update order status */
  async updateStatus(orderId, status) {
    const order = await equipmentOrderRepo.findById(orderId);
    if (!order) throw HttpError.notFound('Order not found');
    const updated = await equipmentOrderRepo.update(orderId, { status });
    await publishEvent(EXCHANGES.ORDERS, 'order.status_updated', {
      orderId, status, userId: order.userId, type: 'equipment',
    }).catch(() => {});
    return updated;
  }

  /** Cancel order (user — only Pending orders) */
  async cancelOrder(userId, orderId, reason) {
    const order = await equipmentOrderRepo.findById(orderId);
    if (!order || order.userId !== userId) {
      throw HttpError.notFound('Order not found or unauthorized');
    }
    if (order.status !== 'Pending') {
      throw HttpError.badRequest('Only pending orders can be cancelled');
    }
    const updated = await equipmentOrderRepo.update(orderId, {
      status: 'Cancelled',
      cancellationReason: reason || 'No reason provided',
    });
    await publishEvent(EXCHANGES.ORDERS, 'order.cancelled', {
      orderId, userId, reason, type: 'equipment',
    }).catch(() => {});
    return updated;
  }
}

export default new EquipmentOrderService();
