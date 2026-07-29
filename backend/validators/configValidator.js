const { body } = require('express-validator');

const configRules = [
  body('appName').optional().isString().trim(),
  body('contactEmail').optional().isEmail().withMessage('Contact email must be valid'),
  body('adminAlertEmail').optional().isEmail().withMessage('Admin alert email must be valid'),
  body('maxImageSizeMB').optional().isNumeric().withMessage('Max image size must be a number'),
  body('maxDocumentSizeMB').optional().isNumeric().withMessage('Max document size must be a number'),
  body('sessionTimeoutMinutes').optional().isNumeric().withMessage('Session timeout must be a number'),
  body('loginAttemptLimit').optional().isNumeric().withMessage('Login attempt limit must be a number'),
];

module.exports = { configRules };
