const Subscription = require('../models/Subscription');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../constants/statusCodes');

/**
 * @desc Get all subscriptions with search, filter, sorting & pagination
 * @route GET /api/subscriptions
 * @access Public / Admin
 */
const getSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const status = req.query.status || 'ALL';
    const planType = req.query.planType || 'ALL';
    const sortBy = req.query.sortBy || 'displayOrder';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // If status is specified as active/inactive, use it. Otherwise default to 'active' for non-admin queries
    if (status !== 'ALL') {
      query.status = status;
    } else if (!req.user || req.user.role !== 'admin') {
      query.status = 'active';
    }

    if (planType !== 'ALL') {
      query.planType = planType;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    let [subscriptions, total] = await Promise.all([
      Subscription.find(query).sort(sortOptions).skip(skip).limit(limit),
      Subscription.countDocuments(query),
    ]);

    // Auto-seed default subscription plans if database collection is empty
    const totalCollectionDocs = await Subscription.countDocuments({});
    if (totalCollectionDocs === 0) {
      const defaultPlans = [
        {
          name: 'Free Membership',
          planType: 'free',
          description: 'Basic access to browse profiles and receive parish match updates.',
          duration: 1,
          durationUnit: 'months',
          price: 0,
          features: ['Browse verified profiles', 'Parish network search', 'Basic profile creation'],
          maxContactRequests: 5,
          maxProfileViews: 20,
          status: 'active',
          displayOrder: 1,
          isPopular: false,
        },
        {
          name: 'Gold Quarterly Plan',
          planType: 'standard',
          description: 'Our most popular plan for active members seeking mutual contact details.',
          duration: 3,
          durationUnit: 'months',
          price: 999,
          features: ['Direct phone & email access', 'Priority parish verification', 'Unlimited profile browsing', 'Highlighted profile badge'],
          maxContactRequests: 25,
          maxProfileViews: 100,
          status: 'active',
          displayOrder: 2,
          isPopular: true,
        },
        {
          name: 'VIP Sacred Family Plan',
          planType: 'vip',
          description: 'Unlimited access with dedicated relationship manager and chaplain consultation.',
          duration: 1,
          durationUnit: 'years',
          price: 2499,
          features: ['Unlimited contact requests', 'Unlimited profile views', 'Personal Relationship Manager', 'Priority parish letter check', 'Pre-Cana retreat guidance'],
          maxContactRequests: -1,
          maxProfileViews: -1,
          status: 'active',
          displayOrder: 3,
          isPopular: false,
        },
      ];
      await Subscription.insertMany(defaultPlans);
      subscriptions = await Subscription.find(query).sort(sortOptions).skip(skip).limit(limit);
      total = subscriptions.length;
    }

    return res.status(OK).json({
      success: true,
      subscriptions,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch subscription plans',
      error: error.message,
    });
  }
};

/**
 * @desc Get single subscription by ID
 * @route GET /api/subscriptions/:id
 * @access Public / Admin
 */
const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(NOT_FOUND).json({ success: false, message: 'Subscription plan not found' });
    }
    return res.status(OK).json({ success: true, subscription });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to fetch subscription detail' });
  }
};

/**
 * @desc Create new subscription plan
 * @route POST /api/subscriptions
 * @access Admin
 */
const createSubscription = async (req, res) => {
  try {
    const {
      name,
      planType,
      description,
      duration,
      durationUnit,
      price,
      currency,
      features,
      maxContactRequests,
      maxProfileViews,
      status,
      displayOrder,
      isPopular,
    } = req.body;

    const subscription = new Subscription({
      name,
      planType: planType || 'standard',
      description: description || '',
      duration: Number(duration),
      durationUnit: durationUnit || 'months',
      price: Number(price),
      currency: currency || 'INR',
      features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
      maxContactRequests: maxContactRequests !== undefined ? Number(maxContactRequests) : -1,
      maxProfileViews: maxProfileViews !== undefined ? Number(maxProfileViews) : -1,
      status: status || 'active',
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      isPopular: Boolean(isPopular),
    });

    await subscription.save();

    return res.status(CREATED).json({
      success: true,
      message: 'Subscription plan created successfully',
      subscription,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create subscription plan',
      error: error.message,
    });
  }
};

/**
 * @desc Update subscription plan
 * @route PUT /api/subscriptions/:id
 * @access Admin
 */
const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(NOT_FOUND).json({ success: false, message: 'Subscription plan not found' });
    }

    const {
      name,
      planType,
      description,
      duration,
      durationUnit,
      price,
      currency,
      features,
      maxContactRequests,
      maxProfileViews,
      status,
      displayOrder,
      isPopular,
    } = req.body;

    if (name !== undefined) subscription.name = name;
    if (planType !== undefined) subscription.planType = planType;
    if (description !== undefined) subscription.description = description;
    if (duration !== undefined) subscription.duration = Number(duration);
    if (durationUnit !== undefined) subscription.durationUnit = durationUnit;
    if (price !== undefined) subscription.price = Number(price);
    if (currency !== undefined) subscription.currency = currency;
    if (features !== undefined) {
      subscription.features = Array.isArray(features) ? features : features.split(',').map(f => f.trim());
    }
    if (maxContactRequests !== undefined) subscription.maxContactRequests = Number(maxContactRequests);
    if (maxProfileViews !== undefined) subscription.maxProfileViews = Number(maxProfileViews);
    if (status !== undefined) subscription.status = status;
    if (displayOrder !== undefined) subscription.displayOrder = Number(displayOrder);
    if (isPopular !== undefined) subscription.isPopular = Boolean(isPopular);

    await subscription.save();

    return res.status(OK).json({
      success: true,
      message: 'Subscription plan updated successfully',
      subscription,
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update subscription plan',
      error: error.message,
    });
  }
};

/**
 * @desc Activate / Deactivate subscription status
 * @route PATCH /api/subscriptions/:id/status
 * @access Admin
 */
const toggleSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(NOT_FOUND).json({ success: false, message: 'Subscription plan not found' });
    }

    subscription.status = subscription.status === 'active' ? 'inactive' : 'active';
    await subscription.save();

    return res.status(OK).json({
      success: true,
      message: `Subscription plan status changed to ${subscription.status}`,
      subscription,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update subscription status',
    });
  }
};

/**
 * @desc Delete subscription plan
 * @route DELETE /api/subscriptions/:id
 * @access Admin
 */
const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!subscription) {
      return res.status(NOT_FOUND).json({ success: false, message: 'Subscription plan not found' });
    }

    return res.status(OK).json({
      success: true,
      message: 'Subscription plan deleted successfully',
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete subscription plan',
    });
  }
};

module.exports = {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  toggleSubscriptionStatus,
  deleteSubscription,
};
