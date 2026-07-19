const planRepository = require('../../repositories/plan.repository');
const subscriptionRepository = require('../../repositories/subscription.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { SUBSCRIPTION_TIERS, SUBSCRIPTION_STATUS } = require('../../constants/subscriptionTiers');

/**
 * Subscription Service
 * Manages active subscriptions and pricing plans.
 */
const subscriptionService = {
  /**
   * Retrieves all active pricing plans.
   *
   * @returns {Promise<Array>} List of pricing plans
   */
  async getPlans() {
    return planRepository.findActivePlans();
  },

  /**
   * Retrieves currently active subscription, or auto-provisions a Free tier if none exists.
   *
   * @param {string} userId
   * @returns {Promise<Object|null>} Active subscription
   */
  async getActiveSubscription(userId) {
    let subscription = await subscriptionRepository.findActiveSubscription(userId);

    if (!subscription) {
      const { Plan, Subscription } = require('../../models/Subscription.model');
      const freePlan = await Plan.findOne({ tier: SUBSCRIPTION_TIERS.FREE });

      if (freePlan) {
        const newSub = await Subscription.create({
          userId,
          planId: freePlan._id,
          status: SUBSCRIPTION_STATUS.ACTIVE,
          startDate: new Date(),
          endDate: new Date(Date.now() + freePlan.durationDays * 24 * 60 * 60 * 1000),
          featuresSnapshot: freePlan.features,
          autoRenew: false,
        });

        subscription = await Subscription.findById(newSub._id).populate('planId').lean();
      }
    }

    return subscription;
  },

  /**
   * Disables auto-renew parameters on the active user subscription.
   *
   * @param {string} userId
   * @returns {Promise<Object>} Updated subscription details
   */
  async cancelSubscription(userId) {
    const { Subscription } = require('../../models/Subscription.model');
    const subscription = await Subscription.findOne({ userId, status: SUBSCRIPTION_STATUS.ACTIVE });
    if (!subscription) {
      throw new ApiError(STATUS.NOT_FOUND, 'No active subscription found.');
    }

    subscription.autoRenew = false;
    await subscription.save();

    return subscription;
  },
};

module.exports = subscriptionService;
