const BaseRepository = require('./base.repository');
const { Message } = require('../models/Chat.model');

class MessageRepository extends BaseRepository {
  constructor() {
    super(Message);
  }

  /**
   * Fetches paginated messages for a specific chat.
   *
   * @param {string} chatId - Target Chat ID
   * @param {Object} options - Pagination details (page, limit)
   * @returns {Promise<Array>} List of messages
   */
  async findChatMessages(chatId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    return this.model
      .find({ chatId, isDeleted: false })
      .sort({ createdAt: -1 }) // Get recent first
      .skip(skip)
      .limit(limit)
      .lean();
  }

  /**
   * Marks all messages from other senders in a chat as read.
   *
   * @param {string} chatId
   * @param {string} userId - Current user (whose messages will NOT be marked read)
   * @returns {Promise<Object>} Mongoose update stats
   */
  async markMessagesAsRead(chatId, userId) {
    return this.model.updateMany(
      { chatId, senderId: { $ne: userId }, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
  }
}

module.exports = new MessageRepository();
