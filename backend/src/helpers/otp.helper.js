const crypto = require('crypto');
const { OTP_LENGTH } = require('../constants/otpPurpose');

/**
 * Generates a cryptographically secure numeric OTP.
 * @param {number} length - OTP digit length (default: 6)
 * @returns {string} Numeric OTP string
 */
const generateOTP = (length = OTP_LENGTH) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const range = max - min + 1;
  const bytes = crypto.randomBytes(4);
  const random = bytes.readUInt32BE(0) % range;
  return String(min + random);
};

/**
 * Calculates OTP expiry date.
 * @param {number} minutes - Minutes from now
 * @returns {Date} Expiry date
 */
const getOTPExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Checks if an OTP has expired.
 * @param {Date} expiresAt - OTP expiry date from DB
 * @returns {boolean}
 */
const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

module.exports = { generateOTP, getOTPExpiry, isOTPExpired };
