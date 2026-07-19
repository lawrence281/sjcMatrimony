const chatService = require('../../services/chat/chat.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Chat Controller
 * Manages HTTP direct messaging, message fetches, and conversation read operations.
 */
const chatController = {
  /**
   * GET /chats
   * Lists conversations for the logged-in user.
   */
  listChats: catchAsync(async (req, res) => {
    const chats = await chatService.listChats(req.user._id);
    sendSuccess(res, SUCCESS.OK, 'Chats retrieved successfully.', chats);
  }),

  /**
   * POST /chats
   * Starts a direct chat room or gets the existing one.
   */
  createChat: catchAsync(async (req, res) => {
    const { recipientId } = req.body;
    const chat = await chatService.getOrCreateChat(req.user._id, recipientId);
    sendSuccess(res, SUCCESS.CREATED, 'Chat room initialized successfully.', { chat });
  }),

  /**
   * GET /chats/:id/messages
   * Fetches paginated direct messages for a conversation.
   */
  listMessages: catchAsync(async (req, res) => {
    const result = await chatService.listMessages(req.params.id, req.query, req.user._id);
    sendSuccess(res, SUCCESS.OK, 'Messages retrieved successfully.', result.messages, {
      page: result.page,
      limit: result.limit,
    });
  }),

  /**
   * POST /chats/:id/messages
   * Sends a direct message over REST API and broadcasts via Socket.io.
   */
  sendMessage: catchAsync(async (req, res) => {
    const { content, type } = req.body;
    const message = await chatService.sendMessage(req.user._id, req.params.id, content, type);

    // Dynamic real-time broadcast to socket room participants
    const io = req.app.get('io');
    if (io) {
      io.to(`chat:${req.params.id}`).emit('chat:message:new', message);
    }

    sendSuccess(res, SUCCESS.CREATED, 'Message sent successfully.', { message });
  }),

  /**
   * PATCH /chats/:id/read
   * Confirms user read state on target conversation.
   */
  markAsRead: catchAsync(async (req, res) => {
    const result = await chatService.markAsRead(req.params.id, req.user._id);
    sendSuccess(res, SUCCESS.OK, 'Messages marked as read.', result);
  }),
};

module.exports = chatController;
