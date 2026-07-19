const notificationRepository = require('../../repositories/notification.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');

/**
 * Notification Service
 * Handles alerts lifecycle and logs.
 */
const notificationService = {
  /**
   * Generates a new alert notification.
   *
   * @param {string} recipientId
   * @param {string} type
   * @param {string} title
   * @param {string} body
   * @param {Object} [data]
   * @returns {Promise<Object>} Created notification
   */
  async createNotification(recipientId, type, title, body, data = {}) {
    return notificationRepository.create({
      recipientId,
      type,
      title,
      body,
      data,
      isRead: false,
    });
  },

  /**
   * Lists notifications for a user.
   *
   * @param {string} recipientId
   * @param {Object} query - Optional isRead query filter
   * @returns {Promise<Array>} List of notifications
   */
  async getNotifications(recipientId, query) {
    const { isRead } = query;
    let isReadBool;

    if (isRead === 'true' || isRead === true) {
      isReadBool = true;
    }
    if (isRead === 'false' || isRead === false) {
      isReadBool = false;
    }

    return notificationRepository.findUserNotifications(recipientId, isReadBool);
  },

  /**
   * Marks a single notification as read.
   *
   * @param {string} recipientId
   * @param {string} notificationId
   * @returns {Promise<Object>} Updated notification
   */
  async markAsRead(recipientId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification) {
      throw new ApiError(STATUS.NOT_FOUND, 'Notification not found.');
    }

    if (notification.recipientId.toString() !== recipientId.toString()) {
      throw new ApiError(STATUS.FORBIDDEN, 'Insufficient permissions.');
    }

    return notificationRepository.updateById(notificationId, {
      isRead: true,
      readAt: new Date(),
    });
  },

  /**
   * Marks all notifications of the user as read.
   *
   * @param {string} recipientId
   * @returns {Promise<Object>} Success message
   */
  async markAllAsRead(recipientId) {
    await notificationRepository.markAllNotificationsAsRead(recipientId);
    return { message: 'All notifications marked as read.' };
  },

  /**
   * Deletes a user notification.
   *
   * @param {string} recipientId
   * @param {string} notificationId
   * @returns {Promise<Object>} Success message
   */
  async deleteNotification(recipientId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification) {
      throw new ApiError(STATUS.NOT_FOUND, 'Notification not found.');
    }

    if (notification.recipientId.toString() !== recipientId.toString()) {
      throw new ApiError(STATUS.FORBIDDEN, 'Insufficient permissions.');
    }

    await notificationRepository.deleteById(notificationId);
    return { message: 'Notification deleted successfully.' };
  },

  /**
   * Gets user's unread notifications count.
   *
   * @param {string} recipientId
   * @returns {Promise<number>} Unread count
   */
  async getUnreadCount(recipientId) {
    const Notification = require('../../models/Notification.model');
    return Notification.countDocuments({ recipientId, isRead: false });
  },
};

module.exports = notificationService;
