import Razorpay from 'razorpay';
import crypto from 'crypto';
import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import paymentRepo from '../repositories/payment.repository.js';

const logger = createLogger('payment-service');

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Razorpay Payment Service — handles payment intents, signature validations, refunds, and event broadcasting.
 */
class PaymentService {
  async createOrder(userId, orderId, amount, currency = 'INR') {
    const rzp = getRazorpay();
    const rzpOrder = await rzp.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: orderId.substring(0, 40),
      notes: { userId, orderId },
    });

    // Save payment record
    const payment = await paymentRepo.create({
      userId, orderId,
      razorpayOrderId: rzpOrder.id,
      amount, currency,
      status: 'created',
    });

    return { razorpayOrder: rzpOrder, paymentId: payment.id };
  }

  async verifyPayment(body) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expected) {
      throw HttpError.badRequest('Invalid payment signature');
    }

    // Update payment record
    const payment = await paymentRepo.update(paymentId, {
      status: 'completed',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    // Publish event
    await publishEvent(EXCHANGES.PAYMENTS, 'payment.completed', {
      paymentId: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
      amount: payment.amount,
    }).catch(() => {});

    return payment;
  }

  async refund(paymentId, amount) {
    const payment = await paymentRepo.findById(paymentId);
    if (!payment) throw HttpError.notFound('Payment not found');
    if (!payment.razorpayPaymentId) throw HttpError.badRequest('No Razorpay payment to refund');

    const rzp = getRazorpay();
    const refund = await rzp.payments.refund(payment.razorpayPaymentId, {
      amount: Math.round((amount || payment.amount) * 100),
    });

    await paymentRepo.update(paymentId, {
      status: 'refunded',
      refundId: refund.id,
      refundAmount: (amount || payment.amount),
    });

    await publishEvent(EXCHANGES.PAYMENTS, 'payment.refunded', {
      paymentId, orderId: payment.orderId, userId: payment.userId, refundAmount: amount || payment.amount,
    }).catch(() => {});

    return refund;
  }

  async getPaymentsByUser(userId) { return paymentRepo.findByUser(userId); }

  async getPaymentsByOrder(orderId) { return paymentRepo.findByOrder(orderId); }
}

export default new PaymentService();
