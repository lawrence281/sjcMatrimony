const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { INTEREST_STATUS } = require('../constants/interestStatus');
const { validate } = require('./auth.validator');

/**
 * Interest request validators using Joi.
 */

const idParamSchema = Joi.object({
  id: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid ID format.',
    'any.required': 'ID is required.',
  }),
});

const sendInterestSchema = Joi.object({
  receiverId: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid receiver user ID format.',
    'any.required': 'Receiver user ID is required.',
  }),
  message: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Invitation message cannot exceed 500 characters.',
  }),
});

const respondInterestSchema = Joi.object({
  status: Joi.string()
    .valid(INTEREST_STATUS.ACCEPTED, INTEREST_STATUS.REJECTED)
    .required()
    .messages({
      'any.only': 'Status must be accepted or rejected.',
      'any.required': 'Status is required.',
    }),
  rejectionReason: Joi.string().trim().max(500).allow('').optional(),
});

const listInterestsSchema = Joi.object({
  status: Joi.string().valid(...Object.values(INTEREST_STATUS)).optional(),
});

module.exports = {
  validate,
  idParamSchema,
  sendInterestSchema,
  respondInterestSchema,
  listInterestsSchema,
};
