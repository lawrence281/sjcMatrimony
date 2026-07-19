const rateLimit = require('express-rate-limit');
const { STATUS } = require('../statusCodes/error');

/**
 * General API rate limiter — 100 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: STATUS.TOO_MANY_REQUESTS,
    message: 'Too many requests from this IP. Please try again later.',
  },
});

/**
 * Strict rate limiter for auth routes — 10 requests per 15 minutes.
 * Protects login, register, and OTP endpoints from brute-force.
 */
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: STATUS.TOO_MANY_REQUESTS,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

module.exports = { apiLimiter, authLimiter };
