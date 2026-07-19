const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { validate } = require('./auth.validator');

/**
 * Blocklist request validators using Joi.
 */

const blockUserSchema = Joi.object({
  blockedUser: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid blocked user ID format.',
    'any.required': 'Blocked user ID is required.',
  }),
  reason: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Reason cannot exceed 500 characters.',
  }),
});

const idParamSchema = Joi.object({
  id: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid ID format.',
    'any.required': 'ID is required.',
  }),
});

module.exports = {
  validate,
  blockUserSchema,
  idParamSchema,
};
