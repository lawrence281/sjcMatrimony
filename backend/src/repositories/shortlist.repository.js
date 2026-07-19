const BaseRepository = require('./base.repository');
const Shortlist = require('../models/Shortlist.model');

class ShortlistRepository extends BaseRepository {
  constructor() {
    super(Shortlist);
  }

  /**
   * Checks if an entry already exists in user's shortlist.
   *
   * @param {string} userId
   * @param {string} shortlistedUserId
   * @returns {Promise<Object|null>} Shortlist entry
   */
  async findShortlistEntry(userId, shortlistedUserId) {
    return this.findOne({ userId, shortlistedUserId });
  }

  /**
   * Retrieves shortlist profiles for a user.
   *
   * @param {string} userId
   * @returns {Promise<Array>} List of shortlisted user objects
   */
  async findUserShortlist(userId) {
    return this.model
      .find({ userId })
      .populate({
        path: 'shortlistedUserId',
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

module.exports = new ShortlistRepository();
