const express = require('express');
const router = express.Router();

/**
 * API v1 Route Registry
 * All route modules are mounted here.
 * Prefix: /api/v1
 */

// ── Auth ──────────────────────────────────────────────────
const authRoutes = require('./auth.routes');
router.use('/auth', authRoutes);

// ── User ──────────────────────────────────────────────────
const userRoutes = require('./user.routes');
router.use('/users', userRoutes);

// ── Profile ───────────────────────────────────────────────
const profileRoutes = require('./profile.routes');
router.use('/profiles', profileRoutes);

// ── Gallery ───────────────────────────────────────────────
const galleryRoutes = require('./gallery.routes');
router.use('/gallery', galleryRoutes);

// ── Search ────────────────────────────────────────────────
const searchRoutes = require('./search.routes');
router.use('/search', searchRoutes);

// ── Interest ──────────────────────────────────────────────
const interestRoutes = require('./interest.routes');
router.use('/interests', interestRoutes);

// ── Shortlist ─────────────────────────────────────────────
const shortlistRoutes = require('./shortlist.routes');
router.use('/shortlist', shortlistRoutes);

// ── Subscription ──────────────────────────────────────────
const subscriptionRoutes = require('./subscription.routes');
router.use('/subscriptions', subscriptionRoutes);

// ── Payment ───────────────────────────────────────────────
const paymentRoutes = require('./payment.routes');
router.use('/payments', paymentRoutes);

// ── Notification ──────────────────────────────────────────
const notificationRoutes = require('./notification.routes');
router.use('/notifications', notificationRoutes);

// ── Chat ──────────────────────────────────────────────────
const chatRoutes = require('./chat.routes');
router.use('/chats', chatRoutes);

// ── Report ────────────────────────────────────────────────
const reportRoutes = require('./report.routes');
router.use('/reports', reportRoutes);

// ── Admin ─────────────────────────────────────────────────
const adminRoutes = require('./admin');
router.use('/admin', adminRoutes);

// ── Health Check ──────────────────────────────────────────
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Matrimony API is running.',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1',
  });
});

// ── Development Helpers ─────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  router.get('/dev/otp/:email', async (req, res) => {
    try {
      const User = require('../models/User.model');
      const Otp = require('../models/Otp.model');
      const user = await User.findOne({ email: req.params.email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const otpRecord = await Otp.findOne({ userId: user._id }).select('+otp').sort({ createdAt: -1 });
      if (!otpRecord) {
        return res.status(404).json({ success: false, message: 'OTP not found' });
      }
      res.status(200).json({ success: true, otp: otpRecord.otp });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
}

module.exports = router;
