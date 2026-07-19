const BaseRepository = require('./base.repository');
const Notification = require('../models/Notification.model');

class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  /**
   * Retrieves user notifications sorted by recent first.
   *
   * @param {string} recipientId
   * @param {boolean} [isRead] - Optional filter flag
   * @returns {Promise<Array>} List of notifications
   */
  async findUserNotifications(recipientId, isRead) {
    const filter = { recipientId };
    if (isRead !== undefined) {
      filter.isRead = isRead;
    }

    return this.model.find(filter).sort({ createdAt: -1 }).lean();
  }

  /**
   * Marks all unread user notifications as read.
   *
   * @param {string} recipientId
   * @returns {Promise<Object>} Mongoose modification results
   */
  async markAllNotificationsAsRead(recipientId) {
    return this.model.updateMany(
      { recipientId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
  }
}

module.exports = new NotificationRepository();
