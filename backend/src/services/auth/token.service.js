const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { JWT_CONFIG } = require('../../constants/jwtConfig');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { AUTH_MESSAGES } = require('../../messages/authMessages');

/**
 * Token Service
 * All JWT operations are centralised here — no jwt.sign/verify calls outside this file.
 */
const tokenService = {
  /**
   * Generates a short-lived JWT access token.
   * @param {Object} payload - { _id, email, role }
   * @returns {string} Signed JWT
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, JWT_CONFIG.ACCESS_SECRET, {
      expiresIn: JWT_CONFIG.ACCESS_EXPIRY,
    });
  },

  /**
   * Generates a long-lived refresh token (opaque random string).
   * Stored hashed in DB; httpOnly cookie sent to client.
   * @returns {{ raw: string, expiry: Date }}
   */
  generateRefreshToken() {
    const raw = crypto.randomBytes(64).toString('hex');
    const expiry = new Date(
      Date.now() + this._parseDurationToMs(JWT_CONFIG.REFRESH_EXPIRY)
    );
    return { raw, expiry };
  },

  /**
   * Verifies a JWT access token and returns its decoded payload.
   * @param {string} token
   * @returns {Object} Decoded payload
   * @throws {ApiError} On invalid or expired token
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT_CONFIG.ACCESS_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(STATUS.UNAUTHORIZED, AUTH_MESSAGES.TOKEN_EXPIRED);
      }
      throw new ApiError(STATUS.UNAUTHORIZED, AUTH_MESSAGES.TOKEN_INVALID);
    }
  },

  /**
   * Generates a cryptographically secure token for password reset links.
   * @returns {{ raw: string, hashed: string, expiry: Date }}
   */
  generatePasswordResetToken() {
    const raw = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(raw).digest('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return { raw, hashed, expiry };
  },

  /**
   * Hashes a plain refresh token for DB storage.
   * @param {string} token
   * @returns {string}
   */
  hashRefreshToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  },

  /**
   * Safely compares plain token with stored hash.
   * @param {string} raw - Plain token from cookie
   * @param {string} hashed - Stored hash in DB
   * @returns {boolean}
   */
  compareRefreshToken(raw, hashed) {
    const rawHashed = this.hashRefreshToken(raw);
    return crypto.timingSafeEqual(Buffer.from(rawHashed), Buffer.from(hashed));
  },

  /**
   * Builds the httpOnly cookie options for refresh tokens.
   * @returns {Object} Express cookie options
   */
  getRefreshCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: this._parseDurationToMs(JWT_CONFIG.REFRESH_EXPIRY),
      path: '/api/v1/auth', // Restrict cookie to auth routes only
    };
  },

  /**
   * Parses JWT duration strings ('15m', '7d') to milliseconds.
   * @private
   */
  _parseDurationToMs(duration) {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1), 10);
    const map = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return value * (map[unit] || 1000);
  },
};

module.exports = tokenService;
