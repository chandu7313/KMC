import 'dotenv/config';

const env = {
  port: parseInt(process.env.PORT || '3010', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'notification-service',

  // Email (Brevo SMTP — matches existing monolith config)
  smtpHost: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMPT_USER || process.env.SMTP_USER,
  smtpPass: process.env.SMPT_PASS || process.env.SMTP_PASS,
  senderEmail: process.env.SENDER_EMAIL || 'noreply@kissanmithar.com',
  senderName: process.env.SENDER_NAME || 'Kissan Mithar Consultancy',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@kissanmithar.com',

  // SMS (Fast2SMS)
  enableSms: process.env.ENABLE_SMS === 'true',
  fast2smsApiKey: process.env.FAST2SMS_API_KEY,

  // RabbitMQ
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};

export default env;
