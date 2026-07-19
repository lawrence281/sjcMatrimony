const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription/subscription.controller');
const verifyToken = require('../middlewares/auth/verifyToken');

// Protect subscription endpoints
router.use(verifyToken);

/**
 * @route   GET /api/v1/subscriptions/plans
 * @desc    Get list of active pricing plans
 * @access  Private (Authenticated)
 */
router.get('/plans', subscriptionController.getPlans);

/**
 * @route   GET /api/v1/subscriptions
 * @desc    Get active subscription details
 * @access  Private (Authenticated)
 */
router.get('/', subscriptionController.getMySubscription);

/**
 * @route   PATCH /api/v1/subscriptions/cancel
 * @desc    Cancel automatic renewal of current subscription
 * @access  Private (Authenticated)
 */
router.patch('/cancel', subscriptionController.cancelMySubscription);

module.exports = router;

