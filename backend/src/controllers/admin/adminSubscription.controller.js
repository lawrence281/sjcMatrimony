const adminSubscriptionService = require('../../services/admin/adminSubscription.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Admin Subscription Controller
 * Manages admin-facing subscription records.
 */
const adminSubscriptionController = {
  /**
   * GET /admin/subscriptions
   * Lists all user subscription records.
   */
  listSubscriptions: catchAsync(async (req, res) => {
    const result = await adminSubscriptionService.listSubscriptions(req.query);
    sendSuccess(
      res,
      SUCCESS.OK,
      'Subscriptions retrieved successfully.',
      result.subscriptions,
      {
        total: result.total,
        page: result.page,
        limit: result.limit,
      }
    );
  }),
};

module.exports = adminSubscriptionController;
