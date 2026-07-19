/**
 * Pagination defaults — enforced on all list endpoints.
 */
const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
});

module.exports = { PAGINATION };
