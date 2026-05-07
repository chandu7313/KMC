import { publishEvent, EXCHANGES, AUTH_EVENTS } from '@kissan/events';
import { createLogger } from '@kissan/shared';

const logger = createLogger('auth-service');

/**
 * Auth event publisher — wraps publishEvent with auth-specific context.
 */

export const publishUserRegistered = async (user) => {
  return publishEvent(EXCHANGES.AUTH, AUTH_EVENTS.USER_REGISTERED, {
    userId: user.id,
    email: user.email,
    name: user.name,
    registeredAt: new Date().toISOString(),
  });
};

export const publishUserLoggedIn = async (userId, method = 'email') => {
  return publishEvent(EXCHANGES.AUTH, AUTH_EVENTS.USER_LOGGED_IN, {
    userId,
    method,
    loggedInAt: new Date().toISOString(),
  });
};

export const publishUserLoggedOut = async (userId) => {
  return publishEvent(EXCHANGES.AUTH, AUTH_EVENTS.USER_LOGGED_OUT, {
    userId,
    loggedOutAt: new Date().toISOString(),
  });
};

export const publishOtpSent = async (phone, isNewUser) => {
  return publishEvent(EXCHANGES.AUTH, AUTH_EVENTS.OTP_SENT, {
    phone,
    isNewUser,
    sentAt: new Date().toISOString(),
  });
};

export const publishPasswordReset = async (userId, email) => {
  return publishEvent(EXCHANGES.AUTH, AUTH_EVENTS.PASSWORD_RESET, {
    userId,
    email,
    resetAt: new Date().toISOString(),
  });
};
