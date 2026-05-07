import 'dotenv/config';

const env = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: process.env.SERVICE_NAME || 'auth-service',
  isProduction: (process.env.NODE_ENV === 'production') || (process.env.VERCEL === '1'),

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),

  // Supabase
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // RabbitMQ
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',

  // SMS
  enableSms: process.env.ENABLE_SMS === 'true',
  fast2smsApiKey: process.env.FAST2SMS_API_KEY,

  // Email
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  senderEmail: process.env.SENDER_EMAIL || process.env.EMAIL_USER,

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || true,
};

// Validate critical env vars
const required = ['jwtSecret', 'supabaseUrl'];
for (const key of required) {
  if (!env[key]) {
    console.warn(`WARNING: Required env var "${key}" is not set. Service may not function correctly.`);
  }
}

export default env;
