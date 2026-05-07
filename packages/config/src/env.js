const Joi = require('joi');

/**
 * Environment variable schema definition.
 * Validates all required environment variables on application startup.
 */
const envVarsSchema = Joi.object({
  // App Config
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(4000),
  SERVICE_NAME: Joi.string().required().description('Name of the current microservice'),

  // JWT Config
  JWT_SECRET: Joi.string().required().description('JWT Access Token Secret'),
  JWT_EXPIRES_IN: Joi.string().default('24h').description('JWT Access Token Expiration'),
  JWT_REFRESH_SECRET: Joi.string().required().description('JWT Refresh Token Secret'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d').description('JWT Refresh Token Expiration'),

  // Supabase (PostgreSQL) Config
  SUPABASE_URL: Joi.string().uri().required().description('Supabase API URL'),
  SUPABASE_ANON_KEY: Joi.string().required().description('Supabase Anonymous Key'),
  SUPABASE_SERVICE_KEY: Joi.string().required().description('Supabase Service Role Key'),

  // MongoDB Config
  MONGODB_URI: Joi.string().uri().required().description('MongoDB Connection URI'),

  // Redis Config
  REDIS_URL: Joi.string().uri().required().description('Redis Connection URL'),

  // RabbitMQ Config
  RABBITMQ_URL: Joi.string().uri().required().description('RabbitMQ Connection URL'),
  RABBITMQ_USER: Joi.string().default('guest'),
  RABBITMQ_PASS: Joi.string().default('guest'),

  // Cloudinary Config
  CLOUDINARY_CLOUD_NAME: Joi.string().required().description('Cloudinary Cloud Name'),
  CLOUDINARY_API_KEY: Joi.string().required().description('Cloudinary API Key'),
  CLOUDINARY_API_SECRET: Joi.string().required().description('Cloudinary API Secret'),

  // Razorpay Config
  RAZORPAY_KEY_ID: Joi.string().required().description('Razorpay Key ID'),
  RAZORPAY_KEY_SECRET: Joi.string().required().description('Razorpay Key Secret'),

  // Third-party APIs
  GEMINI_API_KEY: Joi.string().required().description('Gemini AI API Key'),
  PLANT_ID_API_KEY: Joi.string().required().description('Plant.id API Key'),
  FAST2SMS_API_KEY: Joi.string().required().description('Fast2SMS API Key'),

  // Email/SMTP Config
  SMTP_HOST: Joi.string().required().description('SMTP Server Host'),
  SMTP_PORT: Joi.number().default(587).description('SMTP Server Port'),
  SMTP_USER: Joi.string().required().description('SMTP Server User'),
  SMTP_PASS: Joi.string().required().description('SMTP Server Password'),

  // SMS Configuration Flags
  SMS_ENABLED: Joi.boolean().default(true).description('Flag to enable/disable SMS sending'),

  // Frontend URL
  FRONTEND_URL: Joi.string().uri().required().description('Frontend Application URL')
})
  .unknown() // allow other environment variables to exist
  .required();

// Validate the process.env object against the schema
const { error, value: envVars } = envVarsSchema.validate(process.env, {
  abortEarly: false,
});

// Throw a descriptive error if validation fails
if (error) {
  const missingOrInvalidVars = error.details.map((x) => x.message).join(', ');
  throw new Error(`Environment variables validation error: ${missingOrInvalidVars}`);
}

/**
 * Validated and structured environment configuration object.
 * Imported across all microservices for safe, typed configuration access.
 */
const config = {
  app: {
    nodeEnv: envVars.NODE_ENV,
    port: envVars.PORT,
    serviceName: envVars.SERVICE_NAME,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
  },
  supabase: {
    url: envVars.SUPABASE_URL,
    anonKey: envVars.SUPABASE_ANON_KEY,
    serviceKey: envVars.SUPABASE_SERVICE_KEY,
  },
  mongodb: {
    uri: envVars.MONGODB_URI,
  },
  redis: {
    url: envVars.REDIS_URL,
  },
  rabbitmq: {
    url: envVars.RABBITMQ_URL,
    user: envVars.RABBITMQ_USER,
    pass: envVars.RABBITMQ_PASS,
  },
  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    secret: envVars.CLOUDINARY_API_SECRET,
  },
  razorpay: {
    keyId: envVars.RAZORPAY_KEY_ID,
    keySecret: envVars.RAZORPAY_KEY_SECRET,
  },
  gemini: {
    apiKey: envVars.GEMINI_API_KEY,
  },
  plantId: {
    apiKey: envVars.PLANT_ID_API_KEY,
  },
  fast2sms: {
    apiKey: envVars.FAST2SMS_API_KEY,
  },
  email: {
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT,
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },
  sms: {
    enabled: envVars.SMS_ENABLED,
  },
  frontend: {
    url: envVars.FRONTEND_URL,
  },
};

module.exports = config;
