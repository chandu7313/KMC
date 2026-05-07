import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import fertilizerOrderRepo from '../repositories/fertilizer-order.repository.js';

const logger = createLogger('order-service');

class FertilizerOrderService {
  /** Place a fertilizer order */
  async placeOrder(userId, body) {
    const { items, totalAmount, address } = body;
    if (!items?.length || !totalAmount || !address) {
      throw HttpError.badRequest('items, totalAmount, and address are required');
    }

    const order = await fertilizerOrderRepo.createOrder({
      userId,
      totalAmount: Number(totalAmount),
      address,
      status: 'Pending',
    });

    const orderItems = items.map(item => ({
      orderId: order.id,
      fertilizerId: item.fertilizerId,
      quantity: item.quantity,
      price: item.price,
    }));
    await fertilizerOrderRepo.createOrderItems(orderItems);

    // Decrement stock for each item
    for (const item of items) {
      await fertilizerOrderRepo.decrementStock(item.fertilizerId, item.quantity);
    }

    await publishEvent(EXCHANGES.ORDERS, 'order.created', {
      orderId: order.id, userId, amount: totalAmount, type: 'fertilizer',
    }).catch(() => {});

    return order;
  }

  /** Get orders for a specific user */
  async userOrders(userId) {
    return fertilizerOrderRepo.findByUser(userId);
  }

  /** Admin: get all fertilizer orders */
  async adminOrders() {
    return fertilizerOrderRepo.findAll();
  }

  /** Admin: update order status */
  async updateStatus(orderId, status) {
    const order = await fertilizerOrderRepo.findById(orderId);
    if (!order) throw HttpError.notFound('Order not found');
    const updated = await fertilizerOrderRepo.update(orderId, { status });
    await publishEvent(EXCHANGES.ORDERS, 'order.status_updated', {
      orderId, status, userId: order.userId, type: 'fertilizer',
    }).catch(() => {});
    return updated;
  }
}

export default new FertilizerOrderService();
