const { body } = require('express-validator');

const marriageRegisterRules = [
  body('brideName')
    .notEmpty()
    .withMessage('Bride name is required')
    .isString()
    .trim(),
  body('groomName')
    .notEmpty()
    .withMessage('Groom name is required')
    .isString()
    .trim(),
  body('marriageDate')
    .notEmpty()
    .withMessage('Marriage date is required')
    .isISO8601()
    .withMessage('Marriage date must be a valid date'),
  body('churchName')
    .notEmpty()
    .withMessage('Church name is required')
    .isString()
    .trim(),
  body('marriageStatus')
    .optional()
    .isIn(['registered', 'pending', 'verified', 'cancelled'])
    .withMessage('Invalid marriage status'),
];

module.exports = { marriageRegisterRules };
