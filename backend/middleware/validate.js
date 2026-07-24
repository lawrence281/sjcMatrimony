const { validationResult } = require('express-validator');
const { BAD_REQUEST } = require('../constants/statusCodes');

/**
 * Middleware runner that executes an array of express-validator rules
 * and returns a 400 response if any validation fails.
 *
 * Usage:
 *   router.post('/route', validate(myValidationRules), controller)
 */
const validate = (validations) => async (req, res, next) => {
  // Run all validators in parallel
  await Promise.all(validations.map((v) => v.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validate;
