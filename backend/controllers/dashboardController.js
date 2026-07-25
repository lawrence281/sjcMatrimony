const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

// GET /api/dashboard/analytics
const getAnalytics = async (req, res) => {
  try {
    // Total users and profiles
    const [totalUsers, totalProfiles] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      UserProfile.countDocuments(),
    ]);

    // Profiles by status
    const profilesByStatus = await UserProfile.aggregate([
      { $group: { _id: '$profileStatus', count: { $sum: 1 } } },
    ]);

    // Profiles by verification status
    const profilesByVerification = await UserProfile.aggregate([
      { $group: { _id: '$verificationStatus', count: { $sum: 1 } } },
    ]);

    // Profiles by membership type
    const profilesByMembership = await UserProfile.aggregate([
      { $group: { _id: '$membershipType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Profiles by gender
    const profilesByGender = await UserProfile.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
    ]);

    // Monthly registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, role: 'user' } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Recent profiles
    const recentProfiles = await UserProfile.find()
      .populate('userId', 'name email createdAt')
      .sort('-createdAt')
      .limit(5)
      .select('firstName lastName gender profileStatus verificationStatus membershipType createdAt userId');

    // Pending verifications count
    const pendingVerifications = await UserProfile.countDocuments({ verificationStatus: 'Unverified' });

    // Active profiles count
    const activeProfiles = await UserProfile.countDocuments({ profileStatus: 'Active' });

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalProfiles,
        activeProfiles,
        pendingVerifications,
        profilesByStatus,
        profilesByVerification,
        profilesByMembership,
        profilesByGender,
        monthlyRegistrations,
        recentProfiles,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnalytics };
