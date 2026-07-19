const partnerPreferenceRepository = require('../../repositories/partnerPreference.repository');

/**
 * Partner Preference Service
 * Handles user matchmaking preference settings.
 */
const partnerPreferenceService = {
  /**
   * Retrieves partner preference settings for user.
   *
   * @param {string} userId
   * @returns {Promise<Object>} Preferences details
   */
  async getPreferences(userId) {
    let preference = await partnerPreferenceRepository.findByUserId(userId);

    if (!preference) {
      preference = {
        userId,
        ageMin: 18,
        ageMax: 45,
        maritalStatus: [],
        religion: [],
        caste: [],
        subCaste: [],
        education: [],
        occupation: [],
        country: [],
        state: [],
        city: [],
        complexion: [],
        motherTongue: [],
        languages: [],
        manglik: 'any',
        diet: [],
        smoke: 'any',
        drink: 'any',
        aboutPartner: '',
      };
    }

    return preference;
  },

  /**
   * Creates or updates partner preferences for user.
   *
   * @param {string} userId
   * @param {Object} data
   * @returns {Promise<Object>} Updated preference details
   */
  async updatePreferences(userId, data) {
    const preference = await partnerPreferenceRepository.findOne({ userId });

    if (preference) {
      return partnerPreferenceRepository.updateById(preference._id, data);
    } else {
      return partnerPreferenceRepository.create({ ...data, userId });
    }
  },
};

module.exports = partnerPreferenceService;
