const adminSettingRepository = require('../../repositories/adminSetting.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');

/**
 * Admin Setting Service
 * Manages configuration variables stored in the database.
 */
const adminSettingService = {
  /**
   * Retrieves all stored configuration settings.
   *
   * @returns {Promise<Array>} List of settings
   */
  async getSettings() {
    return adminSettingRepository.find({}, { sort: { key: 1 } });
  },

  /**
   * Updates a single configuration setting value.
   *
   * @param {string} key - Unique setting key
   * @param {*} value - The new configuration value
   * @param {string} userId - The user modifying the setting
   * @returns {Promise<Object>} The updated setting object
   */
  async updateSetting(key, value, userId) {
    const setting = await adminSettingRepository.findByKey(key);
    if (!setting) {
      throw new ApiError(STATUS.NOT_FOUND, 'Setting key not found.');
    }

    return adminSettingRepository.updateByKey(key, value, userId);
  },
};

module.exports = adminSettingService;
