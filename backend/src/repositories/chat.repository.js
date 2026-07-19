const BaseRepository = require('./base.repository');
const { Chat } = require('../models/Chat.model');

class ChatRepository extends BaseRepository {
  constructor() {
    super(Chat);
  }

  /**
   * Retrieves all active chats for a user, populating participant profiles and the last message.
   *
   * @param {string} userId - User ID to fetch chats for
   * @returns {Promise<Array>} List of chats
   */
  async findUserChats(userId) {
    return this.model
      .find({ participants: userId, isActive: true })
      .populate({
        path: 'participants',
        select: 'email phone role',
        populate: {
          path: 'profile',
          select: 'firstName lastName profilePicture gender age',
        },
      })
      .populate('lastMessage')
      .sort({ lastActivityAt: -1 })
      .lean();
  }

  /**
   * Checks if a direct chat exists between two users.
   *
   * @param {string} user1Id
   * @param {string} user2Id
   * @returns {Promise<Object|null>} Chat object if found
   */
  async findChatBetweenUsers(user1Id, user2Id) {
    return this.model
      .findOne({
        participants: { $all: [user1Id, user2Id] },
        isActive: true,
      })
      .populate('lastMessage')
      .lean();
  }
}

module.exports = new ChatRepository();
