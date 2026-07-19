/**
 * HTTP success status codes.
 * Use STATUS.OK instead of hardcoded 200 everywhere.
 */
const SUCCESS_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
});

module.exports = { STATUS: SUCCESS_STATUS };
