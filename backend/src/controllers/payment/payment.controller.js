const paymentService = require('../../services/payment/payment.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Payment Controller
 * Manages subscription checkouts and verification.
 */
const paymentController = {
  /**
   * POST /payments/checkout
   * Generates order credentials for subscription plans.
   */
  createOrder: catchAsync(async (req, res) => {
    const { planId } = req.body;
    const order = await paymentService.createOrder(req.user._id, planId);

    sendSuccess(
      res,
      SUCCESS.CREATED,
      'Payment checkout order generated successfully.',
      order
    );
  }),

  /**
   * POST /payments/verify
   * Validates checkout signature.
   */
  verifyPayment: catchAsync(async (req, res) => {
    const result = await paymentService.verifyPayment(req.user._id, req.body);

    sendSuccess(res, SUCCESS.OK, result.message, {
      subscription: result.subscription,
    });
  }),
};

module.exports = paymentController;
