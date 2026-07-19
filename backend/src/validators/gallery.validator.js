const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { validate } = require('./auth.validator');

/**
 * Gallery request validators using Joi.
 */

const idParamSchema = Joi.object({
  id: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid image ID format.',
    'any.required': 'Image ID is required.',
  }),
});

module.exports = {
  validate,
  idParamSchema,
};
