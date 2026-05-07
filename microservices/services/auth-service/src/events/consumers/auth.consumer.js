import { consumeEvents, EXCHANGES, USER_EVENTS } from '@kissan/events';
import { createLogger } from '@kissan/shared';

const logger = createLogger('auth-service');

/**
 * Auth event consumers — listens for events from other services.
 */
export const startAuthConsumers = async () => {
  // Listen for user profile updates (to sync cache if needed)
  await consumeEvents({
    exchange: EXCHANGES.USER,
    queue: 'auth.user_updates',
    routingKeys: [USER_EVENTS.ROLE_CHANGED, USER_EVENTS.ACCOUNT_DEACTIVATED],
    handler: async (message, meta) => {
      logger.info(`Received user event: ${meta.routingKey}`, {
        userId: message.data?.userId,
      });

      if (meta.routingKey === USER_EVENTS.ACCOUNT_DEACTIVATED) {
        // Invalidate user sessions when account is deactivated
        logger.info(`Invalidating sessions for deactivated user: ${message.data?.userId}`);
        // sessionRepository.deleteSession(message.data.userId);
      }
    },
    options: { prefetch: 5 },
  });

  logger.info('Auth consumers started');
};
