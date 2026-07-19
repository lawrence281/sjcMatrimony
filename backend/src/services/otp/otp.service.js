const otpRepository = require('../../repositories/otp.repository');
const { generateOTP, getOTPExpiry, isOTPExpired } = require('../../helpers/otp.helper');
const { sendOtpEmail } = require('../email/email.service');
const ApiError = require('../../utils/ApiError');
const logger = require('../../utils/logger');
const { STATUS } = require('../../statusCodes/error');
const { AUTH_MESSAGES } = require('../../messages/authMessages');
const { OTP_PURPOSE, OTP_EXPIRY_MINUTES, OTP_MAX_ATTEMPTS } = require('../../constants/otpPurpose');

/**
 * OTP Service
 * Handles OTP generation, delivery, and verification.
 * Delivery channel (SMS/email) is determined per purpose.
 */
const otpService = {
  /**
   * Generates a new OTP for the given user and purpose.
   * Invalidates any previous OTPs for the same purpose first.
   *
   * @param {string} userId
   * @param {string} purpose - OTP_PURPOSE constant
   * @param {string} deliveredTo - Phone or email for audit
   * @returns {Promise<string>} The generated OTP (plain text)
   */
  async generateAndStore(userId, purpose, deliveredTo) {
    // Invalidate any existing unused OTPs for same purpose
    await otpRepository.invalidateOtps(userId, purpose);

    const otp = generateOTP();
    const expiresAt = getOTPExpiry(OTP_EXPIRY_MINUTES);

    await otpRepository.create({
      userId,
      otp,
      purpose,
      expiresAt,
      deliveredTo,
    });

    logger.debug(`OTP generated for user ${userId} | Purpose: ${purpose}`);
    return otp;
  },

  /**
   * Sends OTP via email.
   * @param {{ userId, email, name, purpose }}
   * @returns {Promise<string>} The plain OTP (for SMS provider fallback)
   */
  async sendViaEmail({ userId, email, name, purpose }) {
    const otp = await this.generateAndStore(userId, purpose, email);

    await sendOtpEmail({ to: email, name, otp, purpose });

    return otp;
  },

  /**
   * Verifies a submitted OTP.
   * Enforces attempt limits and expiry checks.
   *
   * @param {{ userId, otp, purpose }}
   * @throws {ApiError} On invalid, expired, or exceeded attempts
   */
  async verify({ userId, otp, purpose }) {
    const record = await otpRepository.findValidOtp(userId, purpose);

    if (!record) {
      throw new ApiError(STATUS.BAD_REQUEST, AUTH_MESSAGES.OTP_INVALID);
    }

    if (isOTPExpired(record.expiresAt)) {
      throw new ApiError(STATUS.BAD_REQUEST, AUTH_MESSAGES.OTP_EXPIRED);
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      throw new ApiError(STATUS.BAD_REQUEST, AUTH_MESSAGES.OTP_MAX_ATTEMPTS);
    }

    // Increment attempt counter before comparing (prevents timing exploit)
    await otpRepository.incrementAttempts(record._id);

    // Constant-time comparison
    const crypto = require('crypto');
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(record.otp),
      Buffer.from(otp)
    );

    if (!isMatch) {
      throw new ApiError(STATUS.BAD_REQUEST, AUTH_MESSAGES.OTP_INVALID);
    }

    // Mark as used
    await otpRepository.markUsed(record._id);

    logger.info(`OTP verified for user ${userId} | Purpose: ${purpose}`);
  },
};

module.exports = otpService;
