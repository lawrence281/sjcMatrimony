const { body } = require('express-validator');

const subscriptionRules = [
  body('name')
    .notEmpty()
    .withMessage('Subscription name is required')
    .isString()
    .trim(),
  body('planType')
    .optional()
    .isIn(['free', 'basic', 'standard', 'premium', 'vip', 'custom'])
    .withMessage('Invalid plan type'),
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isNumeric()
    .withMessage('Duration must be a number'),
  body('durationUnit')
    .optional()
    .isIn(['days', 'months', 'years'])
    .withMessage('Invalid duration unit'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status'),
  body('maxContactRequests')
    .optional()
    .isNumeric()
    .withMessage('Maximum contact requests must be a number'),
  body('maxProfileViews')
    .optional()
    .isNumeric()
    .withMessage('Maximum profile views must be a number'),
  body('displayOrder')
    .optional()
    .isNumeric()
    .withMessage('Display order must be a number'),
];

module.exports = { subscriptionRules };
