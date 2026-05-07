import {
  consumeEvents,
  EXCHANGES,
  QUEUES,
  AUTH_EVENTS,
  ORDER_EVENTS,
  PAYMENT_EVENTS,
  SUPPORT_EVENTS,
  EXPERT_EVENTS,
} from '@kissan/events';
import { createLogger } from '@kissan/shared';
import * as emailService from '../../services/email.service.js';
import * as smsService from '../../services/sms.service.js';
import * as pushService from '../../services/push.service.js';

const logger = createLogger('notification-service');

/**
 * Start all RabbitMQ consumers for the notification service.
 * This is the central hub — listens to events from ALL other services.
 */
export const startNotificationConsumers = async () => {
  // ── Auth Events → Email ──
  await consumeEvents({
    exchange: EXCHANGES.NOTIFICATIONS,
    queue: QUEUES.NOTIFICATION_EMAIL,
    routingKeys: [
      'notification.email_verify',
      'notification.password_reset',
      'notification.password_changed',
      'notification.welcome',
    ],
    handler: async (message, meta) => {
      const { data } = message;
      logger.info(`Processing email event: ${meta.routingKey}`, { userId: data.userId });

      switch (meta.routingKey) {
        case 'notification.email_verify':
          await emailService.sendEmailVerificationOtp(data.email, data.otp);
          break;

        case 'notification.password_reset':
          await emailService.sendPasswordResetOtp(data.email, data.otp);
          break;

        case 'notification.password_changed':
          await emailService.sendPasswordChangedNotification(data.email);
          break;

        case 'notification.welcome':
          // Send welcome email after registration
          const { getWelcomeTemplate } = await import('../../services/template.service.js');
          await emailService.sendEmail({
            to: data.email,
            subject: 'Welcome to Kissan Mithar Consultancy! 🌾',
            html: getWelcomeTemplate(data.name),
          });
          break;

        default:
          logger.warn(`Unhandled email event: ${meta.routingKey}`);
      }
    },
    options: { prefetch: 5 },
  });

  // ── Order Events → Email + SMS ──
  await consumeEvents({
    exchange: EXCHANGES.ORDERS,
    queue: 'notification.order_events',
    routingKeys: [
      ORDER_EVENTS.CREATED,
      ORDER_EVENTS.STATUS_UPDATED,
      ORDER_EVENTS.DELIVERED,
    ],
    handler: async (message, meta) => {
      const { data } = message;
      logger.info(`Processing order event: ${meta.routingKey}`, { orderId: data.orderId });

      switch (meta.routingKey) {
        case ORDER_EVENTS.CREATED:
          // Send order confirmation email
          if (data.email) {
            await emailService.sendOrderConfirmation({
              email: data.email,
              name: data.name,
              orderId: data.orderId,
              address: data.address,
              amount: data.amount,
              paymentMethod: data.paymentMethod,
            });
          }
          // Send SMS
          if (data.phone) {
            await smsService.sendOrderStatusSms(data.phone, data.orderId, 'confirmed');
          }
          // Admin alert
          await emailService.sendAdminAlert(
            `New Order #${data.orderId}`,
            `New order of ₹${data.amount} from ${data.name}`
          );
          break;

        case ORDER_EVENTS.STATUS_UPDATED:
          if (data.phone) {
            await smsService.sendOrderStatusSms(data.phone, data.orderId, data.status);
          }
          break;

        case ORDER_EVENTS.DELIVERED:
          if (data.phone) {
            await smsService.sendOrderStatusSms(data.phone, data.orderId, 'delivered');
          }
          break;
      }
    },
    options: { prefetch: 10 },
  });

  // ── Payment Events → Email ──
  await consumeEvents({
    exchange: EXCHANGES.PAYMENTS,
    queue: 'notification.payment_events',
    routingKeys: [PAYMENT_EVENTS.CONFIRMED, PAYMENT_EVENTS.FAILED, PAYMENT_EVENTS.REFUND_PROCESSED],
    handler: async (message, meta) => {
      const { data } = message;
      logger.info(`Processing payment event: ${meta.routingKey}`, { paymentId: data.paymentId });

      switch (meta.routingKey) {
        case PAYMENT_EVENTS.FAILED:
          if (data.email) {
            await emailService.sendEmail({
              to: data.email,
              subject: 'Payment Failed — Kissan Mithar',
              text: `Your payment of ₹${data.amount} for order #${data.orderId} has failed. Please try again.`,
            });
          }
          break;

        case PAYMENT_EVENTS.REFUND_PROCESSED:
          if (data.email) {
            await emailService.sendEmail({
              to: data.email,
              subject: 'Refund Processed — Kissan Mithar',
              text: `Your refund of ₹${data.amount} for order #${data.orderId} has been processed. It will reflect in 5-7 business days.`,
            });
          }
          break;
      }
    },
    options: { prefetch: 5 },
  });

  // ── Support Events → Email ──
  await consumeEvents({
    exchange: EXCHANGES.SUPPORT,
    queue: 'notification.support_events',
    routingKeys: [SUPPORT_EVENTS.TICKET_CREATED, SUPPORT_EVENTS.TICKET_RESOLVED],
    handler: async (message, meta) => {
      const { data } = message;
      logger.info(`Processing support event: ${meta.routingKey}`, { ticketId: data.ticketId });

      switch (meta.routingKey) {
        case SUPPORT_EVENTS.TICKET_CREATED:
          if (data.email) {
            const { getTicketCreatedTemplate } = await import('../../services/template.service.js');
            await emailService.sendEmail({
              to: data.email,
              subject: `Support Ticket #${data.ticketId} Created`,
              html: getTicketCreatedTemplate({
                name: data.name,
                ticketId: data.ticketId,
                subject: data.subject,
                priority: data.priority,
              }),
            });
          }
          break;

        case SUPPORT_EVENTS.TICKET_RESOLVED:
          if (data.email) {
            await emailService.sendEmail({
              to: data.email,
              subject: `Support Ticket #${data.ticketId} Resolved`,
              text: `Your support ticket #${data.ticketId} has been resolved. If you need further help, feel free to open a new ticket.`,
            });
          }
          break;
      }
    },
    options: { prefetch: 5 },
  });

  // ── Expert/Booking Events → Email + SMS ──
  await consumeEvents({
    exchange: EXCHANGES.EXPERTS,
    queue: 'notification.booking_events',
    routingKeys: [EXPERT_EVENTS.BOOKING_CONFIRMED, EXPERT_EVENTS.CONSULTATION_COMPLETED],
    handler: async (message, meta) => {
      const { data } = message;
      logger.info(`Processing booking event: ${meta.routingKey}`);

      if (meta.routingKey === EXPERT_EVENTS.BOOKING_CONFIRMED) {
        if (data.email) {
          await emailService.sendBookingConfirmation({
            email: data.email,
            name: data.name,
            bookingDetails: {
              date: data.date,
              time: data.time,
              expertName: data.expertName,
              type: data.type,
            },
          });
        }
        // Admin alert
        await emailService.sendAdminAlert(
          'New Consultation Booking',
          `${data.name} booked a ${data.type || 'general'} consultation for ${data.date}`
        );
      }
    },
    options: { prefetch: 5 },
  });

  // ── Auth Events → Analytics forwarding ──
  await consumeEvents({
    exchange: EXCHANGES.AUTH,
    queue: 'notification.auth_events',
    routingKeys: [AUTH_EVENTS.USER_REGISTERED],
    handler: async (message, meta) => {
      const { data } = message;
      if (meta.routingKey === AUTH_EVENTS.USER_REGISTERED && data.email) {
        // Send welcome email
        const { getWelcomeTemplate } = await import('../../services/template.service.js');
        await emailService.sendEmail({
          to: data.email,
          subject: 'Welcome to Kissan Mithar Consultancy! 🌾',
          html: getWelcomeTemplate(data.name),
        });
      }
    },
    options: { prefetch: 5 },
  });

  logger.info('All notification consumers started successfully');
  logger.info('Listening on queues: notification.email, notification.order_events, notification.payment_events, notification.support_events, notification.booking_events, notification.auth_events');
};
