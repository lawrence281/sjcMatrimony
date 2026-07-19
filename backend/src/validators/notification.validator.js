const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { validate } = require('./auth.validator');

/**
 * Notification request validators using Joi.
 */

const idParamSchema = Joi.object({
  id: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid Notification ID format.',
    'any.required': 'Notification ID is required.',
  }),
});

module.exports = {
  validate,
  idParamSchema,
};
