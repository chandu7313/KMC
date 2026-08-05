import axios from 'axios';
import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import orderRepo from '../repositories/order.repository.js';

const logger = createLogger('order-service');

/**
 * Order processing service — handles cart checkout, stock reservation, event publication, and payment confirmation.
 */
class OrderService {
  async placeOrder(userId, body) {
    const { items, amount, address, paymentMethod } = body;
    if (!items?.length || !amount || !address) throw HttpError.badRequest('items, amount, and address required');

    const order = await orderRepo.createOrder({
      userId, totalAmount: amount, address,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
      status: 'Pending',
    });

    const orderItems = items.map(i => ({ orderId: order.id, productId: i.productId, quantity: i.quantity, price: i.price }));
    await orderRepo.createOrderItems(orderItems);

    // Clear cart via ecommerce-service
    try {
      const ecomUrl = process.env.ECOMMERCE_SERVICE_URL || 'http://ecommerce-service:3007';
      await axios.post(`${ecomUrl}/cart/clear`, { userId }, { headers: { 'x-internal-service': 'order-service' }, timeout: 5000 });
    } catch (e) { logger.warn('Cart clear failed:', e.message); }

    // Publish order event for notification-service
    await publishEvent(EXCHANGES.ORDERS, 'order.placed', {
      orderId: order.id, userId, amount, paymentMethod: paymentMethod || 'COD',
    }).catch(() => {});

    return order;
  }

  async userOrders(userId) { return orderRepo.findByUser(userId); }

  async allOrders() { return orderRepo.findAll(); }

  async updateStatus(orderId, status) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw HttpError.notFound('Order not found');
    const updated = await orderRepo.update(orderId, { status });
    await publishEvent(EXCHANGES.ORDERS, 'order.status_updated', { orderId, status, userId: order.userId }).catch(() => {});
    return updated;
  }

  async cancelOrder(userId, orderId, reason) {
    const order = await orderRepo.findById(orderId);
    if (!order || order.userId !== userId) throw HttpError.notFound('Order not found or unauthorized');
    if (order.status !== 'Pending') throw HttpError.badRequest('Only pending orders can be cancelled');
    const updated = await orderRepo.update(orderId, { status: 'Cancelled', cancellationReason: reason || 'No reason' });
    await publishEvent(EXCHANGES.ORDERS, 'order.cancelled', { orderId, userId, reason }).catch(() => {});
    return updated;
  }

  async saveRazorpayOrder(userId, body) {
    const { items, amount, address } = body;
    const order = await orderRepo.createOrder({
      userId, totalAmount: amount, address,
      paymentMethod: 'Razorpay', paymentStatus: 'Pending', status: 'Pending',
    });
    const orderItems = items.map(i => ({ orderId: order.id, productId: i.productId, quantity: i.quantity, price: i.price }));
    await orderRepo.createOrderItems(orderItems);
    return order;
  }

  async confirmPayment(orderId, paymentDetails) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw HttpError.notFound('Order not found');
    const updated = await orderRepo.update(orderId, { paymentStatus: 'Completed', paymentDetails });

    // Clear cart
    try {
      const ecomUrl = process.env.ECOMMERCE_SERVICE_URL || 'http://ecommerce-service:3007';
      await axios.post(`${ecomUrl}/cart/clear`, { userId: order.userId }, { headers: { 'x-internal-service': 'order-service' }, timeout: 5000 });
    } catch (e) { logger.warn('Cart clear failed:', e.message); }

    await publishEvent(EXCHANGES.PAYMENTS, 'payment.confirmed', { orderId, userId: order.userId, amount: order.totalAmount }).catch(() => {});
    return updated;
  }
}

export default new OrderService();
