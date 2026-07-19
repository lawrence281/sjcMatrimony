const profileRepository = require('../../repositories/profile.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { PROFILE_STATUS } = require('../../constants/profileStatus');

/**
 * Admin Profile Service
 * Handles administrative verification and status toggles for user profiles.
 */
const adminProfileService = {
  /**
   * Retrieves paginated, filterable profiles for administrators.
   *
   * @param {Object} query
   * @returns {Promise<{ profiles: Array, total: number, page: number, limit: number }>}
   */
  async listProfiles(query) {
    const { page = 1, limit = 10, status, search, gender } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (gender) {
      filter.gender = gender;
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { profileId: { $regex: search, $options: 'i' } },
      ];
    }

    const profiles = await profileRepository.model
      .find(filter)
      .populate('userId', 'email phone role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await profileRepository.count(filter);

    return {
      profiles,
      total,
      page,
      limit,
    };
  },

  /**
   * Approves a profile, making it visible to other users.
   *
   * @param {string} profileId
   * @param {string} adminId
   * @returns {Promise<Object>} Updated profile
   */
  async approveProfile(profileId, adminId) {
    const profile = await profileRepository.findById(profileId);
    if (!profile) {
      throw new ApiError(STATUS.NOT_FOUND, 'Profile not found.');
    }

    const updateFields = {
      status: PROFILE_STATUS.APPROVED,
      isVerified: true,
      approvedBy: adminId,
      approvedAt: new Date(),
    };

    return profileRepository.updateById(profileId, updateFields);
  },

  /**
   * Rejects a profile, requesting the user to update fields.
   *
   * @param {string} profileId
   * @param {Object} data - Contains reason
   * @param {string} adminId
   * @returns {Promise<Object>} Updated profile
   */
  async rejectProfile(profileId, data, adminId) {
    const profile = await profileRepository.findById(profileId);
    if (!profile) {
      throw new ApiError(STATUS.NOT_FOUND, 'Profile not found.');
    }

    const updateFields = {
      status: PROFILE_STATUS.INCOMPLETE,
      isVerified: false,
      adminNote: data.reason,
    };

    return profileRepository.updateById(profileId, updateFields);
  },

  /**
   * Suspends a profile.
   *
   * @param {string} profileId
   * @param {Object} data - Contains reason
   * @param {string} adminId
   * @returns {Promise<Object>} Updated profile
   */
  async suspendProfile(profileId, data, adminId) {
    const profile = await profileRepository.findById(profileId);
    if (!profile) {
      throw new ApiError(STATUS.NOT_FOUND, 'Profile not found.');
    }

    const updateFields = {
      status: PROFILE_STATUS.SUSPENDED,
      adminNote: data.reason,
    };

    return profileRepository.updateById(profileId, updateFields);
  },
};

module.exports = adminProfileService;
