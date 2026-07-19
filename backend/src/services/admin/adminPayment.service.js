const Payment = require('../../models/Payment.model');

/**
 * Admin Payment Service
 * Retrieves payment transactions log directory for portal admins.
 */
const adminPaymentService = {
  /**
   * Retrieves paginated list of transaction ledgers.
   *
   * @param {Object} query
   * @returns {Promise<{ payments: Array, total: number, page: number, limit: number }>}
   */
  async listPayments(query) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const payments = await Payment.find(filter)
      .populate('userId', 'email phone')
      .populate('planId', 'name tier price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Payment.countDocuments(filter);

    return {
      payments,
      total,
      page,
      limit,
    };
  },
};

module.exports = adminPaymentService;
