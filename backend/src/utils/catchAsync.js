/**
 * Wraps an async route handler to eliminate try/catch boilerplate.
 * Any thrown error is forwarded to Express error middleware via next().
 *
 * Usage:
 *   router.get('/path', catchAsync(async (req, res, next) => { ... }));
 *
 * @param {Function} fn - Async Express handler
 * @returns {Function} Express middleware
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
