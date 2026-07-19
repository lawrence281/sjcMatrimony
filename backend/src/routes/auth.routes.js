const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/auth.controller');
const { authLimiter } = require('../config/rateLimiter');
const verifyToken = require('../middlewares/auth/verifyToken');
const {
  validate,
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('../validators/auth.validator');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new client user
 * @access  Public
 */
router.post('/register', authLimiter, validate(registerSchema), authController.register);

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify registration/email OTP and issue tokens
 * @access  Public
 */
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), authController.verifyOtp);

/**
 * @route   POST /api/v1/auth/resend-otp
 * @desc    Resend registration/email verification OTP
 * @access  Public
 */
router.post('/resend-otp', authLimiter, validate(resendOtpSchema), authController.resendOtp);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user & issue tokens
 * @access  Public
 */
router.post('/login', authLimiter, validate(loginSchema), authController.login);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Rotate/refresh access token using refresh cookie
 * @access  Public (uses httpOnly refresh token cookie)
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Invalidate refresh token and clear cookies
 * @access  Private (Authenticated)
 */
router.post('/logout', verifyToken, authController.logout);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Initiate password reset (emails OTP/link)
 * @access  Public
 */
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Complete password reset using token
 * @access  Public
 */
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password while logged in
 * @access  Private (Authenticated)
 */
router.post('/change-password', verifyToken, validate(changePasswordSchema), authController.changePassword);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user info
 * @access  Private (Authenticated)
 */
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
