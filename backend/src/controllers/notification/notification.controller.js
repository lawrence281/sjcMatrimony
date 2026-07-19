const notificationService = require('../../services/notification/notification.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Notification Controller
 * Manages user notification lookups and updates.
 */
const notificationController = {
  /**
   * GET /notifications
   * Fetches user notifications.
   */
  getNotifications: catchAsync(async (req, res) => {
    const notifications = await notificationService.getNotifications(req.user._id, req.query);
    sendSuccess(res, SUCCESS.OK, 'Notifications retrieved successfully.', notifications);
  }),

  /**
   * PATCH /notifications/:id/read
   * Marks a single notification as read.
   */
  markAsRead: catchAsync(async (req, res) => {
    const notification = await notificationService.markAsRead(req.user._id, req.params.id);
    sendSuccess(res, SUCCESS.OK, 'Notification marked as read successfully.', { notification });
  }),

  /**
   * PATCH /notifications/read-all
   * Marks all unread user notifications as read.
   */
  markAllAsRead: catchAsync(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user._id);
    sendSuccess(res, SUCCESS.OK, result.message);
  }),

  /**
   * DELETE /notifications/:id
   * Removes a single notification.
   */
  deleteNotification: catchAsync(async (req, res) => {
    const result = await notificationService.deleteNotification(req.user._id, req.params.id);
    sendSuccess(res, SUCCESS.OK, result.message);
  }),

  /**
   * GET /notifications/unread-count
   * Fetches unread notifications count.
   */
  getUnreadCount: catchAsync(async (req, res) => {
    const count = await notificationService.getUnreadCount(req.user._id);
    sendSuccess(res, SUCCESS.OK, 'Unread count retrieved successfully.', { count });
  }),
};

module.exports = notificationController;
