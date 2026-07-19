const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { ADMIN_ROLES } = require('../constants/roles');
const { validate } = require('./auth.validator');

/**
 * Admin request validators using Joi.
 */

const idParamSchema = Joi.object({
  id: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid ID format.',
    'any.required': 'ID is required.',
  }),
});

const listAdminUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  role: Joi.string().valid(...ADMIN_ROLES),
  search: Joi.string().trim().allow(''),
  sort: Joi.string().trim().default('-createdAt'),
});

const createAdminUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
    }),
  phone: Joi.string()
    .pattern(REGEX.PHONE_IN)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number.',
      'any.required': 'Phone number is required.',
    }),
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(REGEX.PASSWORD)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
      'any.required': 'Password is required.',
    }),
  role: Joi.string()
    .valid(...ADMIN_ROLES)
    .required()
    .messages({
      'any.only': 'Please specify a valid administrative role.',
      'any.required': 'Administrative role is required.',
    }),
});

const updateAdminUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address.',
    }),
  phone: Joi.string()
    .pattern(REGEX.PHONE_IN)
    .messages({
      'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number.',
    }),
  role: Joi.string().valid(...ADMIN_ROLES).messages({
    'any.only': 'Please specify a valid administrative role.',
  }),
  isActive: Joi.boolean(),
}).min(1);

const updateSettingSchema = Joi.object({
  value: Joi.any().required().messages({
    'any.required': 'Setting value is required.',
  }),
});

module.exports = {
  validate,
  idParamSchema,
  listAdminUsersSchema,
  createAdminUserSchema,
  updateAdminUserSchema,
  updateSettingSchema,
};
