import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  district: Joi.string().max(100).optional(),
  crops: Joi.array().items(Joi.string()).optional(),
  avatar: Joi.string().uri().optional(),
}).min(1).messages({ 'object.min': 'At least one field is required' });

export const updateLanguageSchema = Joi.object({
  language: Joi.string().valid('en', 'hi', 'te').required(),
});

export const updatePreferencesSchema = Joi.object({
  preferredLanguage: Joi.string().valid('en', 'hi', 'te').optional(),
  hasCompletedTour: Joi.boolean().optional(),
  simpleMode: Joi.boolean().optional(),
}).min(1);

export const saveAddressSchema = Joi.object({
  address: Joi.object({
    fullName: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    address: Joi.string().min(10).max(500).required(),
  }).required(),
});

export const changeRoleSchema = Joi.object({
  role: Joi.string().valid('user', 'field-officer').required(),
});

export const createAdminSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid(
    'admin', 'tech_admin', 'agri_expert', 'ecommerce_manager',
    'order_manager', 'support_agent', 'support_manager',
    'content_manager', 'finance_manager', 'field_agent'
  ).required(),
});

export const updateAdminRoleSchema = Joi.object({
  role: Joi.string().valid(
    'admin', 'tech_admin', 'agri_expert', 'ecommerce_manager',
    'order_manager', 'support_agent', 'support_manager',
    'content_manager', 'finance_manager', 'field_agent'
  ).required(),
});
