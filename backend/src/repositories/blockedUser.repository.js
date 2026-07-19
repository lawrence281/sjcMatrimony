const BaseRepository = require('./base.repository');
const BlockedUser = require('../models/BlockedUser.model');

class BlockedUserRepository extends BaseRepository {
  constructor() {
    super(BlockedUser);
  }

  /**
   * Checks if block entry already exists.
   *
   * @param {string} blockedBy
   * @param {string} blockedUser
   * @returns {Promise<Object|null>} Block entry
   */
  async findBlockedEntry(blockedBy, blockedUser) {
    return this.findOne({ blockedBy, blockedUser });
  }

  /**
   * Retrieves list of users blocked by logged-in user.
   *
   * @param {string} blockedBy
   * @returns {Promise<Array>} List of blocked user items
   */
  async findUserBlockedList(blockedBy) {
    return this.model
      .find({ blockedBy })
      .populate({
        path: 'blockedUser',
        select: 'email phone role',
        populate: {
          path: 'profile',
          select: 'firstName lastName profilePicture gender age',
        },
      })
      .sort({ createdAt: -1 })
      .lean();
  }
}

module.exports = new BlockedUserRepository();
