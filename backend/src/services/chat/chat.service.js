const chatRepository = require('../../repositories/chat.repository');
const messageRepository = require('../../repositories/message.repository');
const userRepository = require('../../repositories/user.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { AUTH_MESSAGES } = require('../../messages/authMessages');

/**
 * Chat Service
 * Handles direct messaging, message persistence, and chat room initialization.
 */
const chatService = {
  /**
   * Lists all chats that the user is a participant of.
   *
   * @param {string} userId
   * @returns {Promise<Array>} List of chats
   */
  async listChats(userId) {
    return chatRepository.findUserChats(userId);
  },

  /**
   * Initializes a chat room between two users if it does not already exist.
   *
   * @param {string} user1Id - Creator User ID
   * @param {string} user2Id - Recipient User ID
   * @returns {Promise<Object>} The chat object
   */
  async getOrCreateChat(user1Id, user2Id) {
    if (user1Id === user2Id) {
      throw new ApiError(STATUS.BAD_REQUEST, 'You cannot start a chat with yourself.');
    }

    // Verify recipient user exists
    const recipient = await userRepository.findById(user2Id);
    if (!recipient) {
      throw new ApiError(STATUS.NOT_FOUND, 'Recipient user not found.');
    }

    // Check if chat already exists
    let chat = await chatRepository.findChatBetweenUsers(user1Id, user2Id);

    if (!chat) {
      // Create new chat room
      chat = await chatRepository.create({
        participants: [user1Id, user2Id],
        isActive: true,
      });

      // Populate participants for the response
      chat = await chatRepository.findById(chat._id);
    }

    return chat;
  },

  /**
   * Lists paginated messages inside a chat room.
   *
   * @param {string} chatId - Target Chat ID
   * @param {Object} query - Pagination query parameters
   * @param {string} userId - Requesting user ID for authorization check
   * @returns {Promise<{ messages: Array, page: number, limit: number }>}
   */
  async listMessages(chatId, query, userId) {
    const chat = await chatRepository.findById(chatId);
    if (!chat) {
      throw new ApiError(STATUS.NOT_FOUND, 'Chat room not found.');
    }

    // Verify requesting user is a participant
    const isParticipant = chat.participants.some((p) => p.toString() === userId.toString());
    if (!isParticipant) {
      throw new ApiError(STATUS.FORBIDDEN, AUTH_MESSAGES.FORBIDDEN || 'Access denied.');
    }

    const messages = await messageRepository.findChatMessages(chatId, query);

    return {
      messages,
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 20,
    };
  },

  /**
   * Saves a message to the database and updates chat room activity.
   *
   * @param {string} senderId - Sender User ID
   * @param {string} chatId - Chat ID
   * @param {string} content - Message string
   * @param {string} type - Message type (text, image, document)
   * @returns {Promise<Object>} Persisted message object
   */
  async sendMessage(senderId, chatId, content, type = 'text') {
    const chat = await chatRepository.findById(chatId, '', false);
    if (!chat) {
      throw new ApiError(STATUS.NOT_FOUND, 'Chat room not found.');
    }

    // Verify sender is a participant
    const isParticipant = chat.participants.some((p) => p.toString() === senderId.toString());
    if (!isParticipant) {
      throw new ApiError(STATUS.FORBIDDEN, AUTH_MESSAGES.FORBIDDEN || 'Access denied.');
    }

    // Create the message
    const message = await messageRepository.create({
      chatId,
      senderId,
      content,
      type,
      isRead: false,
    });

    // Update last activity and last message reference on the chat room
    chat.lastMessage = message._id;
    chat.lastActivityAt = new Date();
    await chat.save();

    return message;
  },

  /**
   * Marks unread messages sent by another participant as read.
   *
   * @param {string} chatId - Target Chat ID
   * @param {string} userId - Recipient User ID (marking read)
   * @returns {Promise<Object>} Statistics of read operation
   */
  async markAsRead(chatId, userId) {
    const chat = await chatRepository.findById(chatId);
    if (!chat) {
      throw new ApiError(STATUS.NOT_FOUND, 'Chat room not found.');
    }

    const isParticipant = chat.participants.some((p) => p.toString() === userId.toString());
    if (!isParticipant) {
      throw new ApiError(STATUS.FORBIDDEN, AUTH_MESSAGES.FORBIDDEN || 'Access denied.');
    }

    await messageRepository.markMessagesAsRead(chatId, userId);

    return { success: true };
  },
};

module.exports = chatService;
