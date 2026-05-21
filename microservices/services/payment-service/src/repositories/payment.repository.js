import { models } from '@kissan/shared';

const { Payment } = models;

class PaymentRepository {
  async create(data) {
    const payment = await Payment.create(data);
    return payment.get({ plain: true });
  }

  async findById(id) {
    return Payment.findByPk(id, { raw: true });
  }

  async findByOrder(orderId) {
    return Payment.findAll({
      where: { orderId },
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

  async findByUser(userId) {
    return Payment.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

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
