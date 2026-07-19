const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

/**
 * Sanitizes request body, params, and query against:
 * - MongoDB operator injection ($, .)
 * - XSS attacks (HTML/JS injection)
 *
 * Apply before route handlers.
 */
const sanitizeRequest = [
  mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      // Log sanitization events in production for security monitoring
      if (process.env.NODE_ENV === 'production') {
        console.warn(`Sanitized field "${key}" in ${req.method} ${req.path}`);
      }
    },
  }),
  xss(),
];

module.exports = sanitizeRequest;
