const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { validate } = require('./auth.validator');

/**
 * Payment & Checkout request validators using Joi.
 */

const checkoutSchema = Joi.object({
  planId: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid Plan ID format.',
    'any.required': 'Plan ID is required.',
  }),
});

const verifySchema = Joi.object({
  razorpay_order_id: Joi.string().trim().required().messages({
    'any.required': 'Razorpay Order ID is required.',
  }),
  razorpay_payment_id: Joi.string().trim().required().messages({
    'any.required': 'Razorpay Payment ID is required.',
  }),
  razorpay_signature: Joi.string().trim().required().messages({
    'any.required': 'Razorpay Signature is required.',
  }),
});

module.exports = {
  validate,
  checkoutSchema,
  verifySchema,
};
