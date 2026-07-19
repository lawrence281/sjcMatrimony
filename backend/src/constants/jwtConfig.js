/**
 * JWT configuration constants.
 * Values fall back to process.env at runtime but defaults are defined here.
 */
const JWT_CONFIG = {
  get ACCESS_SECRET() {
    return process.env.JWT_ACCESS_SECRET;
  },
  get REFRESH_SECRET() {
    return process.env.JWT_REFRESH_SECRET;
  },
  ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
};

module.exports = { JWT_CONFIG };
