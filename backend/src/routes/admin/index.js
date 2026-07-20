const express = require('express');
const router = express.Router();

const adminUserRoutes = require('./adminUser.routes');
const adminSettingRoutes = require('./adminSetting.routes');
const adminReportRoutes = require('./adminReport.routes');
const adminProfileRoutes = require('./adminProfile.routes');
const adminPaymentRoutes = require('./adminPayment.routes');
const adminSubscriptionRoutes = require('./adminSubscription.routes');
const adminClientProfileRoutes = require('./adminClientProfile.routes');
const adminDashboardController = require('../../controllers/admin/adminDashboard.controller');
const verifyToken = require('../../middlewares/auth/verifyToken');
const { isAdminRole } = require('../../middlewares/auth/hasPermission');

// Mount JWT token verification and Admin role check for all admin portal sub-routes
router.use(verifyToken);
router.use(isAdminRole);

// ── Admin Sub-routes ───────────────────────────────────────
router.use('/users', adminUserRoutes);
router.use('/settings', adminSettingRoutes);
router.use('/reports', adminReportRoutes);
router.use('/profiles', adminProfileRoutes);
router.use('/payments', adminPaymentRoutes);
router.use('/subscriptions', adminSubscriptionRoutes);
router.use('/client-profiles', adminClientProfileRoutes);

/**
 * @route   GET /api/v1/admin/dashboard
 * @desc    Get dashboard metrics (All admin roles)
 * @access  Private (Admin)
 */
router.get('/dashboard', adminDashboardController.getDashboardStats);

module.exports = router;

