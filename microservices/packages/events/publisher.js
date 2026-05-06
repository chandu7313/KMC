import amqplib from 'amqplib';

let connection = null;
let publishChannel = null;

/**
 * Get or create a RabbitMQ connection.
 * @returns {Promise<amqplib.Connection>}
 */
const getConnection = async () => {
  if (connection) return connection;

  const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

  connection = await amqplib.connect(url);

  connection.on('error', (err) => {
    console.error('RabbitMQ connection error:', err.message);
    connection = null;
    publishChannel = null;
  });

  connection.on('close', () => {
    console.warn('RabbitMQ connection closed');
    connection = null;
    publishChannel = null;
  });

  return connection;
};

/**
 * Get or create a publish channel (reusable for all publishes in a service).
 * @returns {Promise<amqplib.Channel>}
 */
const getPublishChannel = async () => {
  if (publishChannel) return publishChannel;

  const conn = await getConnection();
  publishChannel = await conn.createChannel();

  publishChannel.on('error', (err) => {
    console.error('RabbitMQ channel error:', err.message);
    publishChannel = null;
  });

  publishChannel.on('close', () => {
    publishChannel = null;
  });

  return publishChannel;
};

/**
 * Publish an event to a topic exchange.
 *
 * @param {string} exchange - Exchange name (e.g., 'kissan.orders')
 * @param {string} routingKey - Event type (e.g., 'order.created')
 * @param {object} data - Event payload
 * @param {object} [options] - Additional options
 * @param {string} [options.correlationId] - Request correlation ID
 * @param {string} [options.replyTo] - Reply queue
 * @returns {Promise<boolean>}
 */
const publishEvent = async (exchange, routingKey, data, options = {}) => {
  try {
    const channel = await getPublishChannel();

    // Assert the exchange exists (topic type for flexible routing)
    await channel.assertExchange(exchange, 'topic', {
      durable: true,
      autoDelete: false,
    });

    const message = {
      event: routingKey,
      data,
      timestamp: new Date().toISOString(),
      source: process.env.SERVICE_NAME || 'unknown',
      version: '1.0',
    };

    const messageOptions = {
      persistent: true,
      contentType: 'application/json',
      contentEncoding: 'utf-8',
      timestamp: Date.now(),
      ...(options.correlationId && { correlationId: options.correlationId }),
      ...(options.replyTo && { replyTo: options.replyTo }),
      headers: {
        'x-service': process.env.SERVICE_NAME || 'unknown',
        'x-event-type': routingKey,
      },
    };

    const success = channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      messageOptions
    );

    return success;
  } catch (error) {
    console.error(`Failed to publish event ${routingKey} to ${exchange}:`, error.message);
    return false;
  }
};

/**
 * Gracefully close the RabbitMQ connection.
 */
const closeConnection = async () => {
  try {
    if (publishChannel) await publishChannel.close();
    if (connection) await connection.close();
  } catch (err) {
    console.error('Error closing RabbitMQ:', err.message);
  } finally {
    publishChannel = null;
    connection = null;
  }
};

export { getConnection, getPublishChannel, publishEvent, closeConnection };
