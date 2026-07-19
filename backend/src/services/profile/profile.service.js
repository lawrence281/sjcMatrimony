const profileRepository = require('../../repositories/profile.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { PROFILE_STATUS } = require('../../constants/profileStatus');
const { calculateAge, generateProfileId } = require('../../utils/helpers');

/**
 * Profile Service
 * Handles client profile lifecycle events.
 */
const profileService = {
  /**
   * Creates a new profile for a user.
   *
   * @param {string} userId
   * @param {Object} profileData
   * @returns {Promise<Object>} Created profile
   */
  async createProfile(userId, profileData) {
    // Check if user already has a profile
    const existingProfile = await profileRepository.findByUserId(userId);
    if (existingProfile) {
      throw new ApiError(STATUS.CONFLICT, 'Profile already exists for this user.');
    }

    // Compute age from DOB
    const age = calculateAge(profileData.dateOfBirth);

    // Compute sequential profile ID
    const count = await profileRepository.count({});
    const profileId = generateProfileId(count + 1);

    const profile = await profileRepository.create({
      ...profileData,
      userId,
      profileId,
      age,
      status: PROFILE_STATUS.PENDING,
    });

    return profile;
  },

  /**
   * Retrieves profile by Owner User ID.
   *
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getProfileByUserId(userId) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw new ApiError(STATUS.NOT_FOUND, 'Profile not found.');
    }
    return profile;
  },

  /**
   * Retrieves profile by Profile ID (MAT-XXXXX) or Model ID.
   *
   * @param {string} id - Either model ObjectId or display profileId
   * @returns {Promise<Object>}
   */
  async getProfileById(id) {
    let profile;
    const { REGEX } = require('../../constants/regex');

    if (REGEX.MONGO_ID.test(id)) {
      profile = await profileRepository.findById(id);
    } else {
      profile = await profileRepository.findByProfileId(id);
    }

    if (!profile) {
      throw new ApiError(STATUS.NOT_FOUND, 'Profile not found.');
    }

    return profile;
  },

  /**
   * Updates an existing profile.
   *
   * @param {string} userId - Owner User ID
   * @param {Object} profileData - Update parameters
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(userId, profileData) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw new ApiError(STATUS.NOT_FOUND, 'Profile not found.');
    }

    const updateFields = { ...profileData };

    // Recompute age if DOB changes
    if (profileData.dateOfBirth) {
      updateFields.age = calculateAge(profileData.dateOfBirth);
    }

    return profileRepository.updateById(profile._id, updateFields);
  },
};

module.exports = profileService;
