/**
 * Event type constants for all microservices.
 * Every event published or consumed across the platform is defined here.
 * This ensures type safety and prevents typos in event names.
 */

// ─── Auth Events ───
export const AUTH_EVENTS = {
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGGED_OUT: 'user.logged_out',
  OTP_SENT: 'otp.sent',
  OTP_VERIFIED: 'otp.verified',
  PASSWORD_RESET: 'password.reset',
  TOKEN_REFRESHED: 'token.refreshed',
};

// ─── User Events ───
export const USER_EVENTS = {
  PROFILE_UPDATED: 'user.profile_updated',
  ROLE_CHANGED: 'user.role_changed',
  FARMER_ONBOARDED: 'farmer.onboarded',
  ACCOUNT_DEACTIVATED: 'user.account_deactivated',
  LANGUAGE_CHANGED: 'user.language_changed',
};

// ─── AI Events ───
export const AI_EVENTS = {
  DISEASE_DETECTED: 'disease.detected',
  SOIL_ANALYZED: 'soil.analyzed',
  REQUEST_FAILED: 'ai.request_failed',
  MODEL_FALLBACK: 'ai.model_fallback',
};

// ─── Disease Events ───
export const DISEASE_EVENTS = {
  REPORT_SAVED: 'disease.report_saved',
  RECOMMENDATION_GENERATED: 'recommendation.generated',
};

// ─── Soil Events ───
export const SOIL_EVENTS = {
  REPORT_SAVED: 'soil.report_saved',
  KIT_ORDERED: 'soil.kit_ordered',
};

// ─── Market Events ───
export const MARKET_EVENTS = {
  PRICE_UPDATED: 'market.price_updated',
  ALERT_TRIGGERED: 'market.alert_triggered',
};

// ─── E-Commerce Events ───
export const ECOMMERCE_EVENTS = {
  PRODUCT_ADDED: 'product.added',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_LOW_STOCK: 'product.low_stock',
  CART_UPDATED: 'cart.updated',
  INVENTORY_UPDATED: 'inventory.updated',
};

// ─── Order Events ───
export const ORDER_EVENTS = {
  CREATED: 'order.created',
  STATUS_UPDATED: 'order.status_updated',
  DELIVERED: 'order.delivered',
  DELAYED: 'order.delayed',
  RETURN_REQUESTED: 'return.requested',
  REFUND_INITIATED: 'refund.initiated',
};

// ─── Payment Events ───
export const PAYMENT_EVENTS = {
  CONFIRMED: 'payment.confirmed',
  FAILED: 'payment.failed',
  REFUND_PROCESSED: 'refund.processed',
  SETTLEMENT_RECEIVED: 'settlement.received',
};

// ─── Notification Events ───
export const NOTIFICATION_EVENTS = {
  EMAIL_SENT: 'notification.email_sent',
  SMS_SENT: 'notification.sms_sent',
  PUSH_SENT: 'notification.push_sent',
  DELIVERY_FAILED: 'notification.delivery_failed',
};

// ─── Support Events ───
export const SUPPORT_EVENTS = {
  TICKET_CREATED: 'ticket.created',
  TICKET_ASSIGNED: 'ticket.assigned',
  TICKET_RESOLVED: 'ticket.resolved',
  SLA_BREACHED: 'sla.breached',
};

// ─── Expert Events ───
export const EXPERT_EVENTS = {
  BOOKING_CONFIRMED: 'booking.confirmed',
  CONSULTATION_COMPLETED: 'consultation.completed',
};

// ─── Content Events ───
export const CONTENT_EVENTS = {
  PUBLISHED: 'content.published',
  BANNER_ACTIVATED: 'banner.activated',
};

// ─── Field Events ───
export const FIELD_EVENTS = {
  FARMER_ONBOARDED: 'farmer.onboarded',
  KIT_DELIVERED: 'kit.delivered',
  VISIT_COMPLETED: 'visit.completed',
};

// ─── Exchange Names ───
export const EXCHANGES = {
  AUTH: 'kissan.auth',
  USER: 'kissan.user',
  AI: 'kissan.ai',
  DISEASE: 'kissan.disease',
  SOIL: 'kissan.soil',
  MARKET: 'kissan.market',
  ECOMMERCE: 'kissan.ecommerce',
  ORDERS: 'kissan.orders',
  PAYMENTS: 'kissan.payments',
  NOTIFICATIONS: 'kissan.notifications',
  SUPPORT: 'kissan.support',
  EXPERTS: 'kissan.experts',
  CONTENT: 'kissan.content',
  FIELD: 'kissan.field',
  ANALYTICS: 'kissan.analytics',
};

// ─── Queue Names ───
export const QUEUES = {
  NOTIFICATION_EMAIL: 'notification.email',
  NOTIFICATION_SMS: 'notification.sms',
  NOTIFICATION_PUSH: 'notification.push',
  ANALYTICS_EVENTS: 'analytics.events',
  INVENTORY_UPDATES: 'inventory.updates',
  SUPPORT_AUTO_TICKETS: 'support.auto_tickets',
};

// ─── Dead Letter Queues ───
export const DLQ = {
  FAILED_NOTIFICATIONS: 'dlq.failed_notifications',
  FAILED_PAYMENTS: 'dlq.failed_payments',
  FAILED_EVENTS: 'dlq.failed_events',
};
