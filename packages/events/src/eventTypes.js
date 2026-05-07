/**
 * Comprehensive list of all cross-service event types used in RabbitMQ.
 */
const Events = {
  // Auth Events
  AUTH: {
    USER_REGISTERED: 'auth.user_registered',
    USER_LOGGED_IN: 'auth.user_logged_in',
    USER_LOGGED_OUT: 'auth.user_logged_out',
    OTP_SENT: 'auth.otp_sent',
    OTP_VERIFIED: 'auth.otp_verified',
    TOKEN_REFRESHED: 'auth.token_refreshed',
  },

  // User Events
  USER: {
    PROFILE_UPDATED: 'user.profile_updated',
    ROLE_CHANGED: 'user.role_changed',
    ACCOUNT_BLOCKED: 'user.account_blocked',
    FARMER_ONBOARDED: 'user.farmer_onboarded',
  },

  // Disease Events
  DISEASE: {
    SCAN_STARTED: 'disease.scan_started',
    DETECTED: 'disease.detected',
    REPORT_SAVED: 'disease.report_saved',
    REVIEWED_BY_EXPERT: 'disease.reviewed',
    RECOMMENDATION_GENERATED: 'disease.recommendation',
  },

  // Soil Events
  SOIL: {
    TEST_SUBMITTED: 'soil.test_submitted',
    ANALYZED: 'soil.analyzed',
    REPORT_SAVED: 'soil.report_saved',
    KIT_ORDERED: 'soil.kit_ordered',
    KIT_DELIVERED: 'soil.kit_delivered',
  },

  // Market Events
  MARKET: {
    PRICE_UPDATED: 'market.price_updated',
    ALERT_TRIGGERED: 'market.alert_triggered',
  },

  // E-Commerce Events
  ECOMMERCE: {
    PRODUCT_ADDED: 'ecommerce.product_added',
    PRODUCT_UPDATED: 'ecommerce.product_updated',
    LOW_STOCK: 'ecommerce.low_stock',
    OUT_OF_STOCK: 'ecommerce.out_of_stock',
    CART_UPDATED: 'ecommerce.cart_updated',
    CART_CHECKOUT: 'ecommerce.cart_checkout',
  },

  // Order Events
  ORDER: {
    CREATED: 'order.created',
    PROCESSING: 'order.processing',
    PACKED: 'order.packed',
    SHIPPED: 'order.shipped',
    DELIVERED: 'order.delivered',
    CANCELLED: 'order.cancelled',
    DELAYED: 'order.delayed',
    RETURN_REQUESTED: 'order.return_requested',
    RETURN_APPROVED: 'order.return_approved',
    REFUND_INITIATED: 'order.refund_initiated',
  },

  // Payment Events
  PAYMENT: {
    INITIATED: 'payment.initiated',
    CONFIRMED: 'payment.confirmed',
    FAILED: 'payment.failed',
    REFUNDED: 'payment.refunded',
    SETTLEMENT_RECEIVED: 'payment.settlement',
  },

  // Support Events
  SUPPORT: {
    TICKET_CREATED: 'support.ticket_created',
    TICKET_ASSIGNED: 'support.ticket_assigned',
    TICKET_RESOLVED: 'support.ticket_resolved',
    TICKET_CLOSED: 'support.ticket_closed',
    SLA_BREACHED: 'support.sla_breached',
    AGENT_REPLY: 'support.agent_reply',
    FARMER_REPLY: 'support.farmer_reply',
  },

  // Expert Events
  EXPERT: {
    BOOKING_CONFIRMED: 'expert.booking_confirmed',
    BOOKING_CANCELLED: 'expert.booking_cancelled',
    CALL_COMPLETED: 'expert.call_completed',
    REMINDER_DUE: 'expert.reminder_due',
  },

  // Content Events
  CONTENT: {
    BLOG_PUBLISHED: 'content.blog_published',
    STORY_PUBLISHED: 'content.story_published',
    BANNER_ACTIVATED: 'content.banner_activated',
    ANNOUNCEMENT_SENT: 'content.announcement_sent',
  },

  // Notification Events
  NOTIFICATION: {
    EMAIL_SENT: 'notification.email_sent',
    EMAIL_FAILED: 'notification.email_failed',
    SMS_SENT: 'notification.sms_sent',
    SMS_FAILED: 'notification.sms_failed',
    PUSH_SENT: 'notification.push_sent',
  },

  // Field Events
  FIELD: {
    FARMER_ASSIGNED: 'field.farmer_assigned',
    VISIT_COMPLETED: 'field.visit_completed',
    KIT_DISPATCHED: 'field.kit_dispatched',
    KIT_DELIVERED: 'field.kit_delivered',
  },
};

module.exports = Events;
