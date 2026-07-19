const BaseRepository = require('./base.repository');
const AdminSetting = require('../models/AdminSetting.model');

class AdminSettingRepository extends BaseRepository {
  constructor() {
    super(AdminSetting);
  }

  /**
   * Finds a setting by its unique key.
   *
   * @param {string} key
   * @returns {Promise<Object>}
   */
  async findByKey(key) {
    return this.findOne({ key });
  }

  /**
   * Updates a setting's value by key.
   *
   * @param {string} key
   * @param {*} value
   * @param {string} userId - ID of user making the update
   * @returns {Promise<Object>} Updated setting
   */
  async updateByKey(key, value, userId) {
    return this.updateOne(
      { key },
      { value, updatedBy: userId },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new AdminSettingRepository();
