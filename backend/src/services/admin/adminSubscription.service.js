const { Subscription } = require('../../models/Subscription.model');

/**
 * Admin Subscription Service
 * Retrieves all user subscription records for admin portal review.
 */
const adminSubscriptionService = {
  /**
   * Retrieves paginated list of all user subscriptions.
   *
   * @param {Object} query
   * @returns {Promise<{ subscriptions: Array, total: number, page: number, limit: number }>}
   */
  async listSubscriptions(query) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const subscriptions = await Subscription.find(filter)
      .populate('userId', 'email phone')
      .populate('planId', 'name tier price durationDays')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Subscription.countDocuments(filter);

    return {
      subscriptions,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  },
};

module.exports = adminSubscriptionService;
