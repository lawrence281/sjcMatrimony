const shortlistRepository = require('../../repositories/shortlist.repository');
const userRepository = require('../../repositories/user.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { COMMON_MESSAGES } = require('../../messages/commonMessages');

/**
 * Shortlist Service
 * Handles bookmarking and shortlisting user profiles.
 */
const shortlistService = {
  /**
   * Adds a user to the logged-in user's shortlist.
   *
   * @param {string} userId - Current user ID
   * @param {string} targetUserId - Shortlisted user ID
   * @returns {Promise<Object>} Shortlist entry
   */
  async addToShortlist(userId, targetUserId) {
    if (userId.toString() === targetUserId.toString()) {
      throw new ApiError(STATUS.BAD_REQUEST, 'You cannot shortlist yourself.');
    }

    // Verify target exists
    const targetExists = await userRepository.findById(targetUserId);
    if (!targetExists) {
      throw new ApiError(STATUS.NOT_FOUND, 'Target user not found.');
    }

    // Check if already shortlisted
    const existing = await shortlistRepository.findShortlistEntry(userId, targetUserId);
    if (existing) {
      throw new ApiError(STATUS.CONFLICT, COMMON_MESSAGES.ALREADY_SHORTLISTED);
    }

    return shortlistRepository.create({
      userId,
      shortlistedUserId: targetUserId,
    });
  },

  /**
   * Removes a user from the shortlist.
   *
   * @param {string} userId
   * @param {string} targetUserId
   * @returns {Promise<Object>} Deletion result
   */
  async removeFromShortlist(userId, targetUserId) {
    const entry = await shortlistRepository.findShortlistEntry(userId, targetUserId);
    if (!entry) {
      throw new ApiError(STATUS.NOT_FOUND, 'Shortlist entry not found.');
    }

    await shortlistRepository.deleteById(entry._id);

    return { message: COMMON_MESSAGES.PROFILE_UNSHORTLISTED };
  },

  /**
   * Lists all shortlisted profiles for a user.
   *
   * @param {string} userId
   * @returns {Promise<Array>} List of shortlisted user items
   */
  async getShortlist(userId) {
    return shortlistRepository.findUserShortlist(userId);
  },
};

module.exports = shortlistService;
