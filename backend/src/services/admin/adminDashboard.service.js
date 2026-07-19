const userRepository = require('../../repositories/user.repository');
const Profile = require('../../models/Profile.model');
const Payment = require('../../models/Payment.model');
const { PROFILE_STATUS } = require('../../constants/profileStatus');
const { PAYMENT_STATUS } = require('../../constants/paymentStatus');

/**
 * Admin Dashboard Service
 * Calculates analytics and KPIs for the administrative portal.
 */
const adminDashboardService = {
  /**
   * Retrieves high-level metrics for the admin dashboard.
   *
   * @returns {Promise<{ totalUsers: number, activeProfiles: number, revenueMtd: number, pendingApprovals: number }>}
   */
  async getDashboardStats() {
    const totalUsers = await userRepository.count({});

    // Count profiles that are either approved (visible) or active
    const activeProfiles = await Profile.countDocuments({
      status: { $in: [PROFILE_STATUS.APPROVED, PROFILE_STATUS.ACTIVE] },
    });

    // Count profiles awaiting admin approval
    const pendingApprovals = await Profile.countDocuments({
      status: PROFILE_STATUS.PENDING,
    });

    // Calculate Month-to-Date (MTD) Revenue
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const paymentAgg = await Payment.aggregate([
      {
        $match: {
          status: PAYMENT_STATUS.SUCCESS,
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);

    const revenueMtd = paymentAgg[0]?.totalRevenue || 0;

    return {
      totalUsers,
      activeProfiles,
      revenueMtd,
      pendingApprovals,
    };
  },
};

module.exports = adminDashboardService;
