const express = require('express');
const router = express.Router();
const adminSubscriptionController = require('../../controllers/admin/adminSubscription.controller');

/**
 * @route   GET /api/v1/admin/subscriptions
 * @desc    Get all user subscription records (All admin roles)
 * @access  Private (Admin)
 */
router.get('/', adminSubscriptionController.listSubscriptions);

module.exports = router;
