/**
 * Notification socket handler.
 * Handles marking notifications as read via WebSocket.
 *
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
const notificationHandler = (io, socket) => {
  socket.on('notification:mark_read', async ({ notificationId }) => {
    try {
      // TODO: Call notificationService.markRead in Phase 2
      socket.emit('notification:marked_read', { notificationId });
    } catch (error) {
      socket.emit('notification:error', { message: error.message });
    }
  });
};

/**
 * Utility: Emit a notification to a specific user's personal room.
 * Called by notificationService after creating a notification.
 *
 * @param {import('socket.io').Server} io
 * @param {string} userId
 * @param {Object} notification
 */
const emitNotificationToUser = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification:new', notification);
};

module.exports = notificationHandler;
module.exports.emitNotificationToUser = emitNotificationToUser;
