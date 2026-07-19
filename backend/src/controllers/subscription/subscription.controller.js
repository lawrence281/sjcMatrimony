const subscriptionService = require('../../services/subscription/subscription.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Subscription Controller
 * Maps REST endpoints to SubscriptionService.
 */
const subscriptionController = {
  /**
   * GET /subscriptions/plans
   * Lists active pricing tiers.
   */
  getPlans: catchAsync(async (req, res) => {
    const plans = await subscriptionService.getPlans();
    sendSuccess(res, SUCCESS.OK, 'Subscription plans retrieved successfully.', plans);
  }),

  /**
   * GET /subscriptions
   * Fetches active user subscription details.
   */
  getMySubscription: catchAsync(async (req, res) => {
    const subscription = await subscriptionService.getActiveSubscription(req.user._id);
    sendSuccess(res, SUCCESS.OK, 'Active subscription retrieved successfully.', {
      subscription,
    });
  }),

  /**
   * PATCH /subscriptions/cancel
   * Opts-out of automatic subscription renewal.
   */
  cancelMySubscription: catchAsync(async (req, res) => {
    const subscription = await subscriptionService.cancelSubscription(req.user._id);
    sendSuccess(res, SUCCESS.OK, 'Subscription auto-renew disabled successfully.', {
      subscription,
    });
  }),
};

module.exports = subscriptionController;
