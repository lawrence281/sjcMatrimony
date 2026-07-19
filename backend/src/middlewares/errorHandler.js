const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const { sendError } = require('../helpers/response.helper');
const { STATUS } = require('../statusCodes/error');

/**
 * Global Express error handler middleware.
 * Must be registered LAST — after all routes and other middlewares.
 *
 * Handles:
 * - Custom ApiError instances (operational errors)
 * - Mongoose ValidationError
 * - Mongoose CastError (invalid ObjectId)
 * - JWT errors
 * - Multer errors
 * - Unknown errors (logged, generic message returned)
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // ──────────────────────────────────────────────────────────
  // Mongoose: CastError (invalid MongoDB ObjectId in params)
  // ──────────────────────────────────────────────────────────
  if (err.name === 'CastError') {
    error = new ApiError(STATUS.BAD_REQUEST, `Invalid ${err.path}: ${err.value}`);
  }

  // ──────────────────────────────────────────────────────────
  // Mongoose: Duplicate key error (unique index violation)
  // ──────────────────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new ApiError(STATUS.CONFLICT, `Duplicate value for ${field}. Please use a different value.`);
  }

  // ──────────────────────────────────────────────────────────
  // Mongoose: Validation errors
  // ──────────────────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = new ApiError(STATUS.UNPROCESSABLE_ENTITY, 'Validation failed', errors);
  }

  // ──────────────────────────────────────────────────────────
  // JWT errors
  // ──────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(STATUS.UNAUTHORIZED, 'Invalid authentication token.');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(STATUS.UNAUTHORIZED, 'Authentication token has expired.');
  }

  // ──────────────────────────────────────────────────────────
  // Multer errors
  // ──────────────────────────────────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError(STATUS.BAD_REQUEST, 'File size exceeds the allowed limit.');
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new ApiError(STATUS.BAD_REQUEST, 'Unexpected file field in request.');
  }

  // ──────────────────────────────────────────────────────────
  // Non-operational (programming) errors — log fully
  // ──────────────────────────────────────────────────────────
  if (!error.isOperational) {
    logger.error('NON-OPERATIONAL ERROR:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      user: req.user ? req.user._id : 'unauthenticated',
    });
  }

  // ──────────────────────────────────────────────────────────
  // Log all errors in development
  // ──────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    logger.error(`[${req.method}] ${req.originalUrl} → ${error.statusCode || STATUS.SERVER_ERROR}: ${error.message}`);
  }

  const statusCode = error.statusCode || STATUS.SERVER_ERROR;
  const message =
    error.isOperational
      ? error.message
      : 'An unexpected error occurred. Please try again later.';

  return sendError(res, statusCode, message, error.errors || []);
};

module.exports = errorHandler;
