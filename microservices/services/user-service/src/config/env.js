import 'dotenv/config';

const env = {
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'user-service',
  isProduction: process.env.NODE_ENV === 'production',

  // JWT (for token verification)
  jwtSecret: process.env.JWT_SECRET,

  // Supabase
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // RabbitMQ
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',

  // Bcrypt
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
};

export default env;
