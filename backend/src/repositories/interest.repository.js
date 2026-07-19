const BaseRepository = require('./base.repository');
const Interest = require('../models/Interest.model');

class InterestRepository extends BaseRepository {
  constructor() {
    super(Interest);
  }

  /**
   * Checks if an interest already exists between two users.
   *
   * @param {string} senderId
   * @param {string} receiverId
   * @returns {Promise<Object|null>} Interest object
   */
  async findInterestBetweenUsers(senderId, receiverId) {
    return this.findOne({ senderId, receiverId });
  }

  /**
   * Retrieves interests sent by a user.
   *
   * @param {string} senderId
   * @param {string} [status] - Optional filter status
   * @returns {Promise<Array>} List of sent interests
   */
  async findSentInterests(senderId, status) {
    const filter = { senderId };
    if (status) {
      filter.status = status;
    }

    return this.model
      .find(filter)
      .populate({
        path: 'receiverId',
        select: 'email phone role',
        populate: {
          path: 'profile',
          select: 'firstName lastName profilePicture gender age',
        },
      })
      .sort({ updatedAt: -1 })
      .lean();
  }

  /**
   * Retrieves interests received by a user.
   *
   * @param {string} receiverId
   * @param {string} [status] - Optional filter status
   * @returns {Promise<Array>} List of received interests
   */
  async findReceivedInterests(receiverId, status) {
    const filter = { receiverId };
    if (status) {
      filter.status = status;
    }

    return this.model
      .find(filter)
      .populate({
        path: 'senderId',
        select: 'email phone role',
        populate: {
          path: 'profile',
          select: 'firstName lastName profilePicture gender age',
        },
      })
      .sort({ updatedAt: -1 })
      .lean();
  }
}

module.exports = new InterestRepository();
