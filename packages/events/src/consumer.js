const { logger } = require('@kissan-mithar/shared');

/**
 * RabbitMQ Event Consumer.
 * Handles robust subscription to queues and message processing.
 */
class EventConsumer {
  /**
   * @param {import('amqplib').Connection} connection - Active RabbitMQ connection
   */
  constructor(connection) {
    this.connection = connection;
    this.channels = new Map();
  }

  /**
   * Subscribes to a set of event types via a specific queue bound to an exchange.
   * 
   * @param {string} queue - The queue name
   * @param {string} exchange - The exchange name
   * @param {string[]} eventTypes - Array of routing keys to bind to
   * @param {Function} handler - The async callback function to process the event
   */
  async subscribe(queue, exchange, eventTypes, handler) {
    const channel = await this.connection.createChannel();
    
    // Setup prefetch to distribute load evenly
    await channel.prefetch(10);

    // Setup Dead Letter Exchange/Queue for this queue
    const dlx = `${exchange}.dlx`;
    const dlq = `${queue}.dlq`;
    await this.setupDeadLetterQueue(channel, dlx, dlq);

    // Assert the main queue with DLX bindings
    await channel.assertQueue(queue, { 
      durable: true,
      deadLetterExchange: dlx,
      deadLetterRoutingKey: queue // Preserve original routing
    });

    // Bind the queue to the exchange for each requested eventType (routing key)
    for (const eventType of eventTypes) {
      await channel.bindQueue(queue, exchange, eventType);
    }

    logger.info(`Consumer subscribed to queue ${queue} for events: ${eventTypes.join(', ')}`);

    // Start consuming
    const { consumerTag } = await channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const payload = JSON.parse(msg.content.toString());
        logger.debug(`Consuming event ${payload.eventType} from queue ${queue}`);

        // Process message
        await handler(payload);

        // Acknowledge successful processing
        channel.ack(msg);
      } catch (error) {
        logger.error(`Error processing message from ${queue}: ${error.message}`, { error });
        
        // Reject the message. 'false' means do not requeue, send it to DLX instead.
        channel.nack(msg, false, false);
      }
    });

    // Store the channel so it can be cleanly closed later
    this.channels.set(queue, { channel, consumerTag });
  }

  /**
   * Unsubscribes a specific queue.
   * 
   * @param {string} queue - The queue name to unsubscribe
   */
  async unsubscribe(queue) {
    const subscription = this.channels.get(queue);
    if (subscription) {
      await subscription.channel.cancel(subscription.consumerTag);
      await subscription.channel.close();
      this.channels.delete(queue);
      logger.info(`Unsubscribed from queue: ${queue}`);
    }
  }

  /**
   * Configures the Dead Letter Exchange and Queue.
   * 
   * @param {import('amqplib').Channel} channel 
   * @param {string} dlx - DLX name
   * @param {string} dlq - DLQ name
   */
  async setupDeadLetterQueue(channel, dlx, dlq) {
    // Assert Dead Letter Exchange
    await channel.assertExchange(dlx, 'topic', { durable: true });
    
    // Assert Dead Letter Queue
    await channel.assertQueue(dlq, { durable: true });
    
    // Bind DLQ to DLX (match all)
    await channel.bindQueue(dlq, dlx, '#');
    
    logger.debug(`DLQ configured: ${dlq} bound to ${dlx}`);
  }
}

module.exports = EventConsumer;
