const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userRepository = require('../../repositories/user.repository');
const otpService = require('../otp/otp.service');
const tokenService = require('./token.service');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../email/email.service');
const { appEvents, APP_EVENTS } = require('../../events/eventEmitter');

const ApiError = require('../../utils/ApiError');
const logger = require('../../utils/logger');
const { STATUS } = require('../../statusCodes/error');
const { AUTH_MESSAGES } = require('../../messages/authMessages');
const { ROLES } = require('../../constants/roles');
const { OTP_PURPOSE } = require('../../constants/otpPurpose');
const ActivityLog = require('../../models/ActivityLog.model');

const BCRYPT_ROUNDS = 12;

/**
 * Auth Service
 * All authentication business logic lives here.
 * Controllers only call these methods — no logic in controllers.
 */
const authService = {
  /**
   * REGISTER
   * Creates a new inactive user and sends OTP for email verification.
   *
   * @param {{ email, phone, password, role }} data
   * @param {string} ipAddress
   * @returns {{ message: string, userId: string }}
   */
  async register({ email, phone, password, role = ROLES.CLIENT }, ipAddress) {
    // 1. Check for existing account
    const existing = await userRepository.findByEmailOrPhone(email, phone);
    if (existing) {
      if (existing.email === email.toLowerCase()) {
        throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.PHONE_ALREADY_EXISTS);
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // 3. Create user (inactive until OTP verified)
    const user = await userRepository.create({
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      passwordHash,
      role,
      isActive: true,     // Account is active
      isEmailVerified: false, // But email not yet verified
      isPhoneVerified: false,
    });

    // 4. Generate and send OTP
    await otpService.sendViaEmail({
      userId: user._id,
      email: user.email,
      name: email.split('@')[0], // Use email prefix as name before profile creation
      purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
    });

    logger.info(`New user registered: ${email} | Role: ${role} | IP: ${ipAddress}`);

    return {
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
      userId: user._id,
    };
  },

  /**
   * VERIFY OTP
   * Marks email as verified and issues JWT tokens.
   *
   * @param {{ userId, otp }}
   * @returns {{ accessToken, user }}
   */
  async verifyOtp({ userId, otp }) {
    // 1. Verify OTP (throws if invalid/expired)
    await otpService.verify({
      userId,
      otp,
      purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
    });

    // 2. Fetch user (not lean — need methods)
    const user = await userRepository.findById(userId, '', false);
    if (!user) {
      throw new ApiError(STATUS.NOT_FOUND, 'User not found.');
    }

    // 3. Mark email as verified
    user.isEmailVerified = true;
    await user.save();

    // 4. Generate tokens
    const tokenPayload = { _id: user._id, email: user.email, role: user.role };
    const accessToken = tokenService.generateAccessToken(tokenPayload);
    const { raw: refreshTokenRaw, expiry } = tokenService.generateRefreshToken();

    // 5. Store hashed refresh token
    await userRepository.updateRefreshToken(
      user._id,
      tokenService.hashRefreshToken(refreshTokenRaw),
      expiry
    );

    // 6. Send welcome email (non-blocking)
    sendWelcomeEmail({ to: user.email, name: user.email.split('@')[0] });

    // 7. Emit events
    appEvents.emit(APP_EVENTS.USER_REGISTERED, { userId: user._id, email: user.email });

    logger.info(`OTP verified for user: ${user.email}`);

    return {
      accessToken,
      refreshToken: refreshTokenRaw,
      user: user.toSafeObject(),
    };
  },

  /**
   * LOGIN
   * Validates credentials and issues JWT tokens.
   *
   * @param {{ email, password }}
   * @param {string} ipAddress
   * @returns {{ accessToken, refreshToken, user }}
   */
  async login({ email, password }, ipAddress) {
    // 1. Find user with password hash
    const user = await userRepository.findOne(
      { email: email.toLowerCase() },
      '+passwordHash',
      false // not lean — need instance methods
    );

    if (!user) {
      // Avoid revealing whether email exists
      throw new ApiError(STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // 2. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // 3. Check account status
    if (!user.isActive) {
      throw new ApiError(STATUS.FORBIDDEN, AUTH_MESSAGES.ACCOUNT_INACTIVE);
    }

    // 4. Check email verification
    if (!user.isEmailVerified) {
      // Re-send OTP and prompt for verification
      await otpService.sendViaEmail({
        userId: user._id,
        email: user.email,
        name: user.email.split('@')[0],
        purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
      });
      throw new ApiError(STATUS.FORBIDDEN, AUTH_MESSAGES.EMAIL_NOT_VERIFIED, [
        { field: 'email', message: 'An OTP has been sent to your email. Please verify.' },
      ]);
    }

    // 5. Generate tokens
    const tokenPayload = { _id: user._id, email: user.email, role: user.role };
    const accessToken = tokenService.generateAccessToken(tokenPayload);
    const { raw: refreshTokenRaw, expiry } = tokenService.generateRefreshToken();

    // 6. Store hashed refresh token + update last login
    await Promise.all([
      userRepository.updateRefreshToken(
        user._id,
        tokenService.hashRefreshToken(refreshTokenRaw),
        expiry
      ),
      userRepository.updateLastLogin(user._id),
    ]);

    // 7. Log activity
    ActivityLog.create({
      userId: user._id,
      action: 'LOGIN',
      description: `User logged in from ${ipAddress}`,
      ipAddress,
    }).catch(() => {});

    appEvents.emit(APP_EVENTS.USER_LOGIN, { userId: user._id, email: user.email });
    logger.info(`Login successful: ${email} | IP: ${ipAddress}`);

    return {
      accessToken,
      refreshToken: refreshTokenRaw,
      user: user.toSafeObject(),
    };
  },

  /**
   * REFRESH TOKEN
   * Issues a new access token using the refresh token from httpOnly cookie.
   * Implements token rotation — old refresh token is invalidated.
   *
   * @param {string} refreshTokenRaw - From httpOnly cookie
   * @returns {{ accessToken, refreshToken, user }}
   */
  async refreshToken(refreshTokenRaw) {
    if (!refreshTokenRaw) {
      throw new ApiError(STATUS.UNAUTHORIZED, AUTH_MESSAGES.REFRESH_TOKEN_INVALID);
    }

    // Hash the incoming token to compare with stored hash
    const hashedToken = tokenService.hashRefreshToken(refreshTokenRaw);

    // Find user by hashed refresh token
    const user = await userRepository.findOne(
      {
        refreshToken: hashedToken,
        refreshTokenExpiry: { $gt: new Date() },
        isActive: true,
      },
      '+refreshToken +refreshTokenExpiry',
      false
    );

    if (!user) {
      throw new ApiError(STATUS.UNAUTHORIZED, AUTH_MESSAGES.REFRESH_TOKEN_INVALID);
    }

    // Issue new tokens (rotation)
    const tokenPayload = { _id: user._id, email: user.email, role: user.role };
    const newAccessToken = tokenService.generateAccessToken(tokenPayload);
    const { raw: newRefreshRaw, expiry } = tokenService.generateRefreshToken();

    await userRepository.updateRefreshToken(
      user._id,
      tokenService.hashRefreshToken(newRefreshRaw),
      expiry
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshRaw,
      user: user.toSafeObject(),
    };
  },

  /**
   * LOGOUT
   * Clears the refresh token from DB (invalidates the session).
   *
   * @param {string} userId
   */
  async logout(userId) {
    await userRepository.clearRefreshToken(userId);
    logger.info(`User logged out: ${userId}`);
  },

  /**
   * FORGOT PASSWORD
   * Generates a password reset token and sends reset link via email.
   *
   * @param {string} email
   * @param {string} origin - Request origin for building reset URL
   */
  async forgotPassword(email, origin) {
    // Always return success even if email doesn't exist (prevent enumeration)
    const user = await userRepository.findByEmail(email);
    if (!user) return;

    const { raw, hashed, expiry } = tokenService.generatePasswordResetToken();

    await userRepository.updateById(user._id, {
      passwordResetToken: hashed,
      passwordResetExpiry: expiry,
    });

    const resetUrl = `${origin}/reset-password/${raw}`;

    await sendPasswordResetEmail({
      to: user.email,
      name: user.email.split('@')[0],
      resetUrl,
    });

    logger.info(`Password reset email sent to: ${email}`);
  },

  /**
   * RESET PASSWORD
   * Validates the reset token and updates the password.
   *
   * @param {{ token, newPassword }}
   */
  async resetPassword({ token, newPassword }) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userRepository.findOne(
      {
        passwordResetToken: hashedToken,
        passwordResetExpiry: { $gt: new Date() },
      },
      '',
      false
    );

    if (!user) {
      throw new ApiError(STATUS.BAD_REQUEST, AUTH_MESSAGES.RESET_TOKEN_INVALID);
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    user.passwordHash = passwordHash;
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    // Invalidate all sessions on password change
    user.refreshToken = null;
    user.refreshTokenExpiry = null;
    await user.save();

    logger.info(`Password reset for user: ${user.email}`);
  },

  /**
   * RESEND OTP
   * Generates and resends a new OTP for email verification.
   */
  async resendOtp({ userId, email }) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(STATUS.NOT_FOUND, 'User not found.');
    if (user.isEmailVerified) {
      throw new ApiError(STATUS.BAD_REQUEST, 'Email is already verified.');
    }

    await otpService.sendViaEmail({
      userId,
      email,
      name: email.split('@')[0],
      purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
    });

    return { message: AUTH_MESSAGES.OTP_SENT };
  },

  /**
   * CHANGE PASSWORD (authenticated user)
   */
  async changePassword({ userId, currentPassword, newPassword }) {
    const user = await userRepository.findOne({ _id: userId }, '+passwordHash', false);
    if (!user) throw new ApiError(STATUS.NOT_FOUND, 'User not found.');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(STATUS.BAD_REQUEST, 'Current password is incorrect.');
    }

    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    // Invalidate all sessions
    user.refreshToken = null;
    user.refreshTokenExpiry = null;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);
  },
};

module.exports = authService;
