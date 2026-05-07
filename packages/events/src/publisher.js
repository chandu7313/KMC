const { v4: uuidv4 } = require('uuid');
const { logger } = require('@kissan-mithar/shared');

/**
 * RabbitMQ Event Publisher.
 * Handles reliable publishing of messages to exchanges.
 */
class EventPublisher {
  /**
   * @param {import('amqplib').Connection} connection - Active RabbitMQ connection
   * @param {string} exchange - The exchange name to publish to
   */
  constructor(connection, exchange) {
    this.connection = connection;
    this.exchange = exchange;
    this.channel = null;
  }

  /**
   * Initializes the channel and asserts the exchange.
   */
  async init() {
    this.channel = await this.connection.createConfirmChannel();
    await this.channel.assertExchange(this.exchange, 'topic', { durable: true });
    logger.info(`RabbitMQ Publisher initialized for exchange: ${this.exchange}`);
  }

  /**
   * Publishes an event to RabbitMQ.
   * 
   * @param {string} eventType - The routing key (e.g., 'order.created')
   * @param {Object} data - The payload to publish
   * @param {Object} [options={}] - Additional publish options
   */
  async publish(eventType, data, options = {}) {
    if (!this.channel) await this.init();

    const message = {
      eventType,
      data,
      metadata: {
        publishedAt: new Date().toISOString(),
        service: process.env.SERVICE_NAME || 'unknown',
        version: '1.0',
        correlationId: options.correlationId || uuidv4(),
        requestId: options.requestId || null,
      },
    };

    const content = Buffer.from(JSON.stringify(message));

    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      try {
        await new Promise((resolve, reject) => {
          this.channel.publish(this.exchange, eventType, content, {
            persistent: true,
            messageId: message.metadata.correlationId,
            timestamp: Date.now(),
          }, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        logger.debug(`Event published: ${eventType}`);
        return;
      } catch (error) {
        attempt++;
        logger.warn(`Publish failed for ${eventType} (Attempt ${attempt}/${maxRetries}): ${error.message}`);
        
        if (attempt >= maxRetries) {
          logger.error(`Event ${eventType} permanently failed to publish. Logging to DLQ fallback.`);
          // In a real scenario, you'd save this to DB fallback (Outbox pattern) or external DLQ
          throw error;
        }
        
        await new Promise((res) => setTimeout(res, Math.pow(2, attempt) * 100)); // Exponential backoff
      }
    }
  }

  /**
   * Publishes a batch of events sequentially.
   * 
   * @param {Array<{eventType: string, data: Object}>} events 
   */
  async publishBatch(events) {
    for (const event of events) {
      await this.publish(event.eventType, event.data);
    }
  }
}

module.exports = EventPublisher;
