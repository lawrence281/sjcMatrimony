const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { validate } = require('./auth.validator');

/**
 * Report request validators using Joi.
 */

const createReportSchema = Joi.object({
  reportedUser: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid reported user ID format.',
    'any.required': 'Reported user ID is required.',
  }),
  reason: Joi.string()
    .valid('fake_profile', 'inappropriate_content', 'harassment', 'spam', 'scam', 'other')
    .required()
    .messages({
      'any.only': 'Please specify a valid report reason.',
      'any.required': 'Report reason is required.',
    }),
  description: Joi.string().trim().max(1000).allow('').optional().messages({
    'string.max': 'Description cannot exceed 1000 characters.',
  }),
});

const resolveReportSchema = Joi.object({
  status: Joi.string().valid('resolved', 'dismissed').required().messages({
    'any.only': 'Please specify a valid status (resolved or dismissed).',
    'any.required': 'Resolution status is required.',
  }),
  adminNote: Joi.string().trim().max(1000).allow('').optional().messages({
    'string.max': 'Admin note cannot exceed 1000 characters.',
  }),
});

const listReportsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('pending', 'under_review', 'resolved', 'dismissed'),
  reason: Joi.string().valid('fake_profile', 'inappropriate_content', 'harassment', 'spam', 'scam', 'other'),
});

module.exports = {
  validate,
  createReportSchema,
  resolveReportSchema,
  listReportsSchema,
};
