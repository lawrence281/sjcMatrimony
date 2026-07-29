const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { subscriptionRules } = require('../validators/subscriptionValidator');
const {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  toggleSubscriptionStatus,
  deleteSubscription,
} = require('../controllers/subscriptionController');

// Public or Protected listing
router.get('/', getSubscriptions);
router.get('/:id', getSubscriptionById);

// Admin-only endpoints
router.post('/', protect, adminOnly, validate(subscriptionRules), createSubscription);
router.put('/:id', protect, adminOnly, validate(subscriptionRules), updateSubscription);
router.patch('/:id/status', protect, adminOnly, toggleSubscriptionStatus);
router.delete('/:id', protect, adminOnly, deleteSubscription);

module.exports = router;
