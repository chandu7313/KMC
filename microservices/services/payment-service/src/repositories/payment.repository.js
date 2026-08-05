import { models } from '@kissan/shared';

const { Payment } = models;

/**
 * Data access repository for Payment transaction records.
 */
class PaymentRepository {
  /**
   * Create a new payment record.
   * @param {object} data - Payment details
   * @returns {Promise<object>} Created plain payment record
   */
  async create(data) {
    const payment = await Payment.create(data);
    return payment.get({ plain: true });
  }

  /**
   * Find payment by ID.
   * @param {string} id - Payment UUID
   * @returns {Promise<object|null>} Plain record or null
   */
  async findById(id) {
    return Payment.findByPk(id, { raw: true });
  }

  /**
   * List all payment transactions for an order.
   * @param {string} orderId - Order UUID
   * @returns {Promise<Array>} List of payments
   */
  async findByOrder(orderId) {
    return Payment.findAll({
      where: { orderId },
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

  /**
   * List all payments made by a user.
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} List of payments
   */
  async findByUser(userId) {
    return Payment.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

  /**
   * Update payment status and gateway attributes.
   * @param {string} id - Payment UUID
   * @param {object} updates - Updates
   * @returns {Promise<object>} Updated record
   */
  async update(id, updates) {
    const [_, [updatedPayment]] = await Payment.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedPayment;
  }
}

export default new PaymentRepository();
