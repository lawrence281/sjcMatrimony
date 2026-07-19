const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { validate } = require('./auth.validator');

/**
 * Chat request validators using Joi.
 */

const idParamSchema = Joi.object({
  id: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid ID format.',
    'any.required': 'ID is required.',
  }),
});

const createChatSchema = Joi.object({
  recipientId: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid recipient user ID format.',
    'any.required': 'Recipient user ID is required.',
  }),
});

const listMessagesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const sendMessageSchema = Joi.object({
  content: Joi.string().trim().max(2000).required().messages({
    'string.max': 'Message content cannot exceed 2000 characters.',
    'any.required': 'Message content is required.',
  }),
  type: Joi.string().valid('text', 'image', 'document').default('text'),
});

module.exports = {
  validate,
  idParamSchema,
  createChatSchema,
  listMessagesSchema,
  sendMessageSchema,
};
