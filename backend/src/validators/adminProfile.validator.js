const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { validate } = require('./auth.validator');

/**
 * Admin Profile request validators using Joi.
 */

const idParamSchema = Joi.object({
  id: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid Profile ID format.',
    'any.required': 'Profile ID is required.',
  }),
});

const rejectProfileSchema = Joi.object({
  reason: Joi.string().trim().max(500).required().messages({
    'any.required': 'Rejection reason is required.',
  }),
});

const suspendProfileSchema = Joi.object({
  reason: Joi.string().trim().max(500).required().messages({
    'any.required': 'Suspension reason is required.',
  }),
});

module.exports = {
  validate,
  idParamSchema,
  rejectProfileSchema,
  suspendProfileSchema,
};
