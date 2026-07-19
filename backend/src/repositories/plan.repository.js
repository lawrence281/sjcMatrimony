const BaseRepository = require('./base.repository');
const { Plan } = require('../models/Subscription.model');

class PlanRepository extends BaseRepository {
  constructor() {
    super(Plan);
  }

  /**
   * Retrieves active subscription plans sorted by display order.
   *
   * @returns {Promise<Array>} List of active plans
   */
  async findActivePlans() {
    return this.find({ isActive: true }, { sort: { displayOrder: 1 } });
  }
}

module.exports = new PlanRepository();
