const BaseRepository = require('./base.repository');
const { Subscription } = require('../models/Subscription.model');

class SubscriptionRepository extends BaseRepository {
  constructor() {
    super(Subscription);
  }

  /**
   * Retrieves user's current active subscription populated with plan details.
   *
   * @param {string} userId
   * @returns {Promise<Object|null>} Active subscription document
   */
  async findActiveSubscription(userId) {
    return this.model
      .findOne({ userId, status: 'active' })
      .populate('planId')
      .lean();
  }
}

module.exports = new SubscriptionRepository();
