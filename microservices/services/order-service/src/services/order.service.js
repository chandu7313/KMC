import axios from 'axios';
import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import orderRepo from '../repositories/order.repository.js';

const logger = createLogger('order-service');

/**
 * Order processing service — handles cart checkout, stock reservation, event publication, and payment confirmation.
 */
class OrderService {
  /**
   * Place a new order (Cash on Delivery or general flow), clear user cart, and broadcast event.
   * @param {string} userId - Customer UUID
   * @param {object} body - Order payload (items, amount, address, paymentMethod)
   * @returns {Promise<object>} Created order record
   * @throws {HttpError} If missing items, amount, or address
   */
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

  /**
   * Fetch all orders placed by a specific user.
   * @param {string} userId - Customer UUID
   * @returns {Promise<Array>} List of orders with items
   */
  async userOrders(userId) { return orderRepo.findByUser(userId); }

  /**
   * Admin: List all orders across all customers.
   * @returns {Promise<Array>} List of all orders
   */
  async allOrders() { return orderRepo.findAll(); }

  /**
   * Admin: Update fulfillment status of an order and notify user.
   * @param {string} orderId - Order UUID
   * @param {string} status - New order status
   * @returns {Promise<object>} Updated order
   * @throws {HttpError} If order not found
   */
  async updateStatus(orderId, status) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw HttpError.notFound('Order not found');
    const updated = await orderRepo.update(orderId, { status });
    await publishEvent(EXCHANGES.ORDERS, 'order.status_updated', { orderId, status, userId: order.userId }).catch(() => {});
    return updated;
  }

  /**
   * Customer: Cancel a pending order with a reason.
   * @param {string} userId - Customer UUID
   * @param {string} orderId - Order UUID
   * @param {string} [reason] - Cancellation explanation
   * @returns {Promise<object>} Updated cancelled order
   * @throws {HttpError} If unauthorized or order not in pending status
   */
  async cancelOrder(userId, orderId, reason) {
    const order = await orderRepo.findById(orderId);
    if (!order || order.userId !== userId) throw HttpError.notFound('Order not found or unauthorized');
    if (order.status !== 'Pending') throw HttpError.badRequest('Only pending orders can be cancelled');
    const updated = await orderRepo.update(orderId, { status: 'Cancelled', cancellationReason: reason || 'No reason' });
    await publishEvent(EXCHANGES.ORDERS, 'order.cancelled', { orderId, userId, reason }).catch(() => {});
    return updated;
  }

  /**
   * Save Razorpay order record in DB awaiting payment completion.
   * @param {string} userId - Customer UUID
   * @param {object} body - Items and amount
   * @returns {Promise<object>} Created order record
   */
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

  /**
   * Confirm successful payment on Razorpay order and clear user's cart.
   * @param {string} orderId - Order UUID
   * @param {object} paymentDetails - Razorpay transaction signatures
   * @returns {Promise<object>} Updated order
   * @throws {HttpError} If order not found
   */
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
