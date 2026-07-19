const express = require('express');
const router = express.Router();
const adminPaymentController = require('../../controllers/admin/adminPayment.controller');

/**
 * @route   GET /api/v1/admin/payments
 * @desc    Get all payments transaction log histories (All admin roles)
 * @access  Private (Admin)
 */
router.get('/', adminPaymentController.listPayments);

module.exports = router;
