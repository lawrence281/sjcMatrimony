const { STATUS: SUCCESS } = require('../statusCodes/success');
const { STATUS: ERROR } = require('../statusCodes/error');

/**
 * Sends a standardised success response.
 *
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable success message
 * @param {*}      data - Response payload
 * @param {Object} meta - Pagination metadata
 */
const sendSuccess = (res, statusCode = SUCCESS.OK, message = 'Success', data = null, meta = null) => {
  const response = { success: true, statusCode, message };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * Sends a standardised error response.
 *
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable error message
 * @param {Array}  errors - Field-level validation errors
 */
const sendError = (res, statusCode = ERROR.SERVER_ERROR, message = 'Error', errors = []) => {
  const response = { success: false, statusCode, message };
  if (errors.length > 0) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
