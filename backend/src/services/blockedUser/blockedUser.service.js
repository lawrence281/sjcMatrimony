const blockedUserRepository = require('../../repositories/blockedUser.repository');
const userRepository = require('../../repositories/user.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');

/**
 * Blocked User Service
 * Manages user blocklists.
 */
const blockedUserService = {
  /**
   * Blocks a user.
   *
   * @param {string} blockedBy - Logged-in user ID
   * @param {string} blockedUser - ID of user to block
   * @param {string} [reason] - Block reason
   * @returns {Promise<Object>} Block record
   */
  async blockUser(blockedBy, blockedUser, reason = null) {
    if (blockedBy.toString() === blockedUser.toString()) {
      throw new ApiError(STATUS.BAD_REQUEST, 'You cannot block your own account.');
    }

    // Verify target exists
    const targetUser = await userRepository.findById(blockedUser);
    if (!targetUser) {
      throw new ApiError(STATUS.NOT_FOUND, 'Target user not found.');
    }

    // Check duplicate
    const existing = await blockedUserRepository.findBlockedEntry(blockedBy, blockedUser);
    if (existing) {
      throw new ApiError(STATUS.CONFLICT, 'You have already blocked this user.');
    }

    return blockedUserRepository.create({
      blockedBy,
      blockedUser,
      reason,
    });
  },

  /**
   * Unblocks a user.
   *
   * @param {string} blockedBy
   * @param {string} blockedUser
   * @returns {Promise<Object>} Success response
   */
  async unblockUser(blockedBy, blockedUser) {
    const entry = await blockedUserRepository.findBlockedEntry(blockedBy, blockedUser);
    if (!entry) {
      throw new ApiError(STATUS.NOT_FOUND, 'Block entry not found.');
    }

    await blockedUserRepository.deleteById(entry._id);

    return { message: 'User unblocked successfully.' };
  },

  /**
   * Lists blocked users of a user.
   *
   * @param {string} blockedBy
   * @returns {Promise<Array>} Block list
   */
  async getBlockList(blockedBy) {
    return blockedUserRepository.findUserBlockedList(blockedBy);
  },
};

module.exports = blockedUserService;
