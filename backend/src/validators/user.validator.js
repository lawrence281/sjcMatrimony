const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { ROLES } = require('../constants/roles');
const { validate } = require('./auth.validator');

/**
 * User request validators using Joi.
 */

const idParamSchema = Joi.object({
  id: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid User ID format.',
    'any.required': 'User ID is required.',
  }),
});

const listUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  role: Joi.string().valid(...Object.values(ROLES)),
  isActive: Joi.boolean(),
  search: Joi.string().trim().allow(''),
  sort: Joi.string().trim().default('-createdAt'),
});

const updateUserSchema = Joi.object({
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
  role: Joi.string().valid(...Object.values(ROLES)),
  isActive: Joi.boolean(),
}).min(1);

module.exports = {
  validate,
  idParamSchema,
  listUsersSchema,
  updateUserSchema,
};
