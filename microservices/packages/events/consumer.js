import amqplib from 'amqplib';
import { DLQ } from './eventTypes.js';

let connection = null;

/**
 * Get or create a consumer connection (separate from publisher).
 * @returns {Promise<amqplib.Connection>}
 */
const getConsumerConnection = async () => {
  if (connection) return connection;

  const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  connection = await amqplib.connect(url);

  connection.on('error', (err) => {
    console.error('RabbitMQ consumer connection error:', err.message);
    connection = null;
  });

  connection.on('close', () => {
    connection = null;
  });

  return connection;
};

/**
 * Subscribe to events on a topic exchange.
 *
 * @param {object} config
 * @param {string} config.exchange - Exchange to bind to (e.g., 'kissan.orders')
 * @param {string} config.queue - Queue name (e.g., 'notification.email')
 * @param {string|string[]} config.routingKeys - Routing key pattern(s) (e.g., 'order.*' or ['order.created', 'order.delivered'])
 * @param {Function} config.handler - Async handler function (message) => Promise<void>
 * @param {object} [config.options] - Additional options
 * @param {number} [config.options.prefetch=10] - Prefetch count
 * @param {boolean} [config.options.deadLetter=true] - Enable dead letter queue
 * @param {number} [config.options.retryLimit=3] - Max retry attempts
 * @returns {Promise<void>}
 *
 * @example
 * await consumeEvents({
 *   exchange: EXCHANGES.ORDERS,
 *   queue: QUEUES.NOTIFICATION_EMAIL,
 *   routingKeys: ['order.created', 'order.delivered'],
 *   handler: async (message) => {
 *     await sendEmail(message.data);
 *   },
 * });
 */
const consumeEvents = async (config) => {
  const {
    exchange,
    queue,
    routingKeys,
    handler,
    options = {},
  } = config;

  const {
    prefetch = 10,
    deadLetter = true,
    retryLimit = 3,
  } = options;

  const conn = await getConsumerConnection();
  const channel = await conn.createChannel();
  await channel.prefetch(prefetch);

  // Assert the exchange
  await channel.assertExchange(exchange, 'topic', {
    durable: true,
    autoDelete: false,
  });

  // Setup dead letter exchange and queue if enabled
  const queueOptions = { durable: true };
  if (deadLetter) {
    const dlxExchange = `${exchange}.dlx`;
    const dlqQueue = DLQ.FAILED_EVENTS;

    await channel.assertExchange(dlxExchange, 'topic', { durable: true });
    await channel.assertQueue(dlqQueue, { durable: true });
    await channel.bindQueue(dlqQueue, dlxExchange, '#');

    queueOptions.deadLetterExchange = dlxExchange;
    queueOptions.deadLetterRoutingKey = queue;
  }

  // Assert the consumer queue
  await channel.assertQueue(queue, queueOptions);

  // Bind routing keys
  const keys = Array.isArray(routingKeys) ? routingKeys : [routingKeys];
  for (const key of keys) {
    await channel.bindQueue(queue, exchange, key);
  }

  // Start consuming
  await channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());
      const retryCount = (msg.properties.headers?.['x-retry-count'] || 0);

      await handler(content, {
        routingKey: msg.fields.routingKey,
        exchange: msg.fields.exchange,
        correlationId: msg.properties.correlationId,
        retryCount,
      });

      channel.ack(msg);
    } catch (error) {
      const retryCount = (msg.properties.headers?.['x-retry-count'] || 0) + 1;

      console.error(
        `Error processing message from ${queue} (attempt ${retryCount}/${retryLimit}):`,
        error.message
      );

      if (retryCount >= retryLimit) {
        // Send to DLQ
        channel.nack(msg, false, false);
      } else {
        // Requeue with incremented retry count
        channel.nack(msg, false, false);

        // Re-publish with retry header
        channel.publish(
          exchange,
          msg.fields.routingKey,
          msg.content,
          {
            ...msg.properties,
            headers: {
              ...msg.properties.headers,
              'x-retry-count': retryCount,
              'x-last-error': error.message,
            },
          }
        );
      }
    }
  });

  console.info(`Consumer started: ${queue} bound to ${exchange} [${keys.join(', ')}]`);
};

/**
 * Close the consumer connection.
 */
const closeConsumerConnection = async () => {
  try {
    if (connection) await connection.close();
  } catch (err) {
    console.error('Error closing consumer connection:', err.message);
  } finally {
    connection = null;
  }
};

export { consumeEvents, closeConsumerConnection };
