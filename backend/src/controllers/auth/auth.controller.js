const authService = require('../../services/auth/auth.service');
const tokenService = require('../../services/auth/token.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { AUTH_MESSAGES } = require('../../messages/authMessages');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Auth Controller
 * Thin layer — only handles HTTP concerns (req, res, next).
 * All business logic lives in authService.
 */
const authController = {
  /**
   * POST /auth/register
   * Creates a new user account and sends OTP.
   */
  register: catchAsync(async (req, res) => {
    const { email, phone, password } = req.body;
    const ipAddress = req.ip || req.connection?.remoteAddress;

    const result = await authService.register({ email, phone, password }, ipAddress);

    sendSuccess(res, SUCCESS.CREATED, result.message, { userId: result.userId });
  }),

  /**
   * POST /auth/verify-otp
   * Verifies email OTP and issues JWT tokens.
   */
  verifyOtp: catchAsync(async (req, res) => {
    const { userId, otp } = req.body;

    const { accessToken, refreshToken, user } = await authService.verifyOtp({ userId, otp });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, tokenService.getRefreshCookieOptions());

    sendSuccess(res, SUCCESS.OK, AUTH_MESSAGES.LOGIN_SUCCESS, { accessToken, user });
  }),

  /**
   * POST /auth/resend-otp
   * Resends OTP for email verification.
   */
  resendOtp: catchAsync(async (req, res) => {
    const { userId, email } = req.body;
    const result = await authService.resendOtp({ userId, email });
    sendSuccess(res, SUCCESS.OK, result.message);
  }),

  /**
   * POST /auth/login
   * Authenticates user and issues tokens.
   */
  login: catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection?.remoteAddress;

    const { accessToken, refreshToken, user } = await authService.login(
      { email, password },
      ipAddress
    );

    res.cookie('refreshToken', refreshToken, tokenService.getRefreshCookieOptions());

    sendSuccess(res, SUCCESS.OK, AUTH_MESSAGES.LOGIN_SUCCESS, { accessToken, user });
  }),

  /**
   * POST /auth/refresh-token
   * Issues a new access token using the httpOnly refresh cookie.
   */
  refreshToken: catchAsync(async (req, res) => {
    // Accept from httpOnly cookie or Authorization header (mobile clients)
    const rawToken =
      req.signedCookies?.refreshToken ||
      req.cookies?.refreshToken ||
      req.body?.refreshToken;

    const { accessToken, refreshToken, user } = await authService.refreshToken(rawToken);

    // Rotate cookie
    res.cookie('refreshToken', refreshToken, tokenService.getRefreshCookieOptions());

    sendSuccess(res, SUCCESS.OK, 'Token refreshed.', { accessToken, user });
  }),

  /**
   * POST /auth/logout
   * Invalidates refresh token and clears cookie.
   */
  logout: catchAsync(async (req, res) => {
    await authService.logout(req.user._id);

    // Clear the cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/api/v1/auth',
    });

    sendSuccess(res, SUCCESS.OK, AUTH_MESSAGES.LOGOUT_SUCCESS);
  }),

  /**
   * POST /auth/forgot-password
   * Sends password reset link (always returns success).
   */
  forgotPassword: catchAsync(async (req, res) => {
    const { email } = req.body;
    const origin = req.get('origin') || req.get('referer')?.replace(/\/$/, '') || process.env.CLIENT_ORIGIN;

    await authService.forgotPassword(email, origin);

    // Always return same message (prevents email enumeration)
    sendSuccess(
      res,
      SUCCESS.OK,
      'If this email is registered, a password reset link has been sent.'
    );
  }),

  /**
   * POST /auth/reset-password
   * Sets a new password using the reset token.
   */
  resetPassword: catchAsync(async (req, res) => {
    const { token, newPassword } = req.body;

    await authService.resetPassword({ token, newPassword });

    sendSuccess(res, SUCCESS.OK, AUTH_MESSAGES.PASSWORD_RESET_SUCCESS);
  }),

  /**
   * POST /auth/change-password
   * Authenticated users changing their own password.
   */
  changePassword: catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword({
      userId: req.user._id,
      currentPassword,
      newPassword,
    });

    // Clear refresh token cookie — user must log in again
    res.clearCookie('refreshToken', {
      httpOnly: true,
      path: '/api/v1/auth',
    });

    sendSuccess(res, SUCCESS.OK, 'Password changed successfully. Please log in again.');
  }),

  /**
   * GET /auth/me
   * Returns the authenticated user's profile.
   */
  getMe: catchAsync(async (req, res) => {
    const userRepository = require('../../repositories/user.repository');
    const user = await userRepository.findById(req.user._id);

    if (!user) {
      const ApiError = require('../../utils/ApiError');
      const { STATUS } = require('../../statusCodes/error');
      throw new ApiError(STATUS.NOT_FOUND, 'User not found.');
    }

    sendSuccess(res, SUCCESS.OK, 'User retrieved.', { user });
  }),
};

module.exports = authController;
