const { validate } = require('./auth.validator');

/**
 * Subscription request validators using Joi.
 * Minimal schemas since most user actions depend directly on JWT user info.
 */
module.exports = {
  validate,
};
