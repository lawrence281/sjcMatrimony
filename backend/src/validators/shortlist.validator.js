const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { validate } = require('./auth.validator');

/**
 * Shortlist request validators using Joi.
 */

const shortlistActionSchema = Joi.object({
  shortlistedUserId: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid user ID format.',
    'any.required': 'User ID to shortlist is required.',
  }),
});

module.exports = {
  validate,
  shortlistActionSchema,
};
