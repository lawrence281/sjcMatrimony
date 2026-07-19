const BaseRepository = require('./base.repository');
const PartnerPreference = require('../models/PartnerPreference.model');

class PartnerPreferenceRepository extends BaseRepository {
  constructor() {
    super(PartnerPreference);
  }

  /**
   * Retrieves user's partner preferences document.
   *
   * @param {string} userId
   * @returns {Promise<Object|null>} Preferences document
   */
  async findByUserId(userId) {
    return this.findOne({ userId });
  }
}

module.exports = new PartnerPreferenceRepository();
