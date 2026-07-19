const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment/payment.controller');
const verifyToken = require('../middlewares/auth/verifyToken');
const { validate, checkoutSchema, verifySchema } = require('../validators/payment.validator');

// Protect payment endpoints
router.use(verifyToken);

/**
 * @route   POST /api/v1/payments/checkout
 * @desc    Create a payment checkout order in Razorpay
 * @access  Private (Authenticated)
 */
router.post('/checkout', validate(checkoutSchema, 'body'), paymentController.createOrder);

/**
 * @route   POST /api/v1/payments/verify
 * @desc    Verify signature and provision subscription tier
 * @access  Private (Authenticated)
 */
router.post('/verify', validate(verifySchema, 'body'), paymentController.verifyPayment);

module.exports = router;
