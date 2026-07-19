/**
 * Custom application error class.
 * Extends the native Error with statusCode and operational flag.
 *
 * `isOperational: true` means this is a known, expected error (400, 401, 404).
 * `isOperational: false` means this is a programming/system error — alert needed.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Human-readable error message
   * @param {Array}  errors - Optional field-level validation errors
   * @param {boolean} isOperational - Whether error is expected (default: true)
   */
  constructor(statusCode, message, errors = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    // Capture stack trace (V8 only), excluding this constructor from the stack
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
