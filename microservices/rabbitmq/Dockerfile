FROM rabbitmq:3-management-alpine

# Copy custom configurations
COPY rabbitmq.conf /etc/rabbitmq/rabbitmq.conf
COPY definitions.json /etc/rabbitmq/definitions.json

# Expose AMQP and Management UI ports
EXPOSE 5672 15672
