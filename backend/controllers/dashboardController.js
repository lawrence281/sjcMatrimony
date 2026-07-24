const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// GET /api/dashboard/analytics
const getAnalytics = async (req, res) => {
  try {
    // Total purchases and revenue
    const [totalOrders, totalRevenue] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Orders by geography (city/state)
    const ordersByGeo = await Order.aggregate([
      {
        $group: {
          _id: { city: '$shippingAddress.city', state: '$shippingAddress.state', country: '$shippingAddress.country' },
          count: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Most purchased products
    const topProducts = await Product.find()
      .populate('category', 'name')
      .sort('-salesCount')
      .limit(5)
      .select('name salesCount price images averageRating');

    // Top users by order count
    const topUsers = await Order.aggregate([
      { $match: { user: { $exists: true, $ne: null } } },
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpent: { $sum: '$total' } } },
      { $sort: { orderCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          name: '$userDetails.name',
          email: '$userDetails.email',
          avatar: '$userDetails.avatar',
          orderCount: 1,
          totalSpent: 1,
        },
      },
    ]);

    // Monthly revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5);

    // Total products and users
    const [totalProducts, totalUsers] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
    ]);

    res.json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalProducts,
        totalUsers,
        ordersByStatus,
        ordersByGeo,
        topProducts,
        topUsers,
        monthlyRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnalytics };
