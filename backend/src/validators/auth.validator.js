const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { ROLES } = require('../constants/roles');

/**
 * Auth Validators using Joi.
 * Each exported object is a Joi schema for the corresponding route body.
 * Run through validateRequest middleware in routes.
 */

/**
 * Validates the incoming Joi schema against req.body/params/query.
 * Returns a middleware function.
 *
 * @param {Joi.ObjectSchema} schema
 * @param {string} property - 'body' | 'params' | 'query'
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,       // Return ALL validation errors at once
      stripUnknown: true,      // Remove unknown fields from the request
      convert: true,
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/['"]/g, ''),
      }));

      return res.status(422).json({
        success: false,
        statusCode: 422,
        message: 'Validation failed.',
        errors,
      });
    }

    // Replace req[property] with validated + sanitised value
    req[property] = value;
    next();
  };
};

// ── Schema Definitions ─────────────────────────────────────

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
    }),

  phone: Joi.string()
    .pattern(REGEX.PHONE_IN)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number.',
      'any.required': 'Phone number is required.',
    }),

  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(REGEX.PASSWORD)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
      'any.required': 'Password is required.',
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match.',
      'any.required': 'Please confirm your password.',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
    }),

  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});

const verifyOtpSchema = Joi.object({
  userId: Joi.string().trim().required().messages({
    'any.required': 'User ID is required.',
  }),
  otp: Joi.string()
    .pattern(REGEX.OTP)
    .required()
    .messages({
      'string.pattern.base': 'OTP must be a 6-digit number.',
      'any.required': 'OTP is required.',
    }),
});

const resendOtpSchema = Joi.object({
  userId: Joi.string().trim().required(),
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().trim().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
    }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().required().messages({
    'any.required': 'Reset token is required.',
  }),
  newPassword: Joi.string()
    .min(8)
    .max(64)
    .pattern(REGEX.PASSWORD)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
      'any.required': 'New password is required.',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match.',
      'any.required': 'Please confirm your new password.',
    }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(64)
    .pattern(REGEX.PASSWORD)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({ 'any.only': 'Passwords do not match.' }),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
