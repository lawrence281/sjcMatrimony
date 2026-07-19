const logger = require('../../utils/logger');
const chatService = require('../../services/chat/chat.service');

/**
 * Chat socket event handler.
 * Handles real-time message sending and read receipts.
 *
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
const chatHandler = (io, socket) => {
  socket.on('chat:join', (chatId) => {
    socket.join(`chat:${chatId}`);
    logger.debug(`User ${socket.user._id} joined chat room: ${chatId}`);
  });

  socket.on('chat:leave', (chatId) => {
    socket.leave(`chat:${chatId}`);
    logger.debug(`User ${socket.user._id} left chat room: ${chatId}`);
  });

  socket.on('chat:message', async (data) => {
    try {
      const { chatId, content, type = 'text' } = data;

      // Persist the message in the database via ChatService
      const message = await chatService.sendMessage(socket.user._id, chatId, content, type);

      // Broadcast the persisted message object (including generated _id and timestamp)
      io.to(`chat:${chatId}`).emit('chat:message:new', message);
    } catch (error) {
      socket.emit('chat:error', { message: error.message });
    }
  });

  socket.on('chat:read', async ({ chatId }) => {
    try {
      await chatService.markAsRead(chatId, socket.user._id);

      // Notify other participant that messages in this room have been read
      socket.to(`chat:${chatId}`).emit('chat:read', { chatId, userId: socket.user._id });
    } catch (error) {
      socket.emit('chat:error', { message: error.message });
    }
  });

  socket.on('chat:typing', ({ chatId }) => {
    socket.to(`chat:${chatId}`).emit('chat:typing', { userId: socket.user._id, chatId });
  });

  socket.on('chat:stop_typing', ({ chatId }) => {
    socket.to(`chat:${chatId}`).emit('chat:stop_typing', { userId: socket.user._id, chatId });
  });
};

module.exports = chatHandler;

