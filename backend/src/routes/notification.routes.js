const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification/notification.controller');
const verifyToken = require('../middlewares/auth/verifyToken');
const { validate, idParamSchema } = require('../validators/notification.validator');

// Protect notification endpoints
router.use(verifyToken);

/**
 * @route   GET /api/v1/notifications
 * @desc    Get notifications list for the user
 * @access  Private (Authenticated)
 */
router.get('/', notificationController.getNotifications);

/**
 * @route   GET /api/v1/notifications/unread-count
 * @desc    Get count of unread notifications
 * @access  Private (Authenticated)
 */
router.get('/unread-count', notificationController.getUnreadCount);

/**
 * @route   PATCH /api/v1/notifications/read-all
 * @desc    Mark all unread notifications of the user as read
 * @access  Private (Authenticated)
 */
router.patch('/read-all', notificationController.markAllAsRead);

/**
 * @route   PATCH /api/v1/notifications/mark-all-read
 * @desc    Mark all unread notifications as read (alternative hook)
 * @access  Private (Authenticated)
 */
router.patch('/mark-all-read', notificationController.markAllAsRead);

/**
 * @route   PATCH /api/v1/notifications/:id/read
 * @desc    Mark a single notification as read
 * @access  Private (Authenticated)
 */
router.patch('/:id/read', validate(idParamSchema, 'params'), notificationController.markAsRead);

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Remove a notification
 * @access  Private (Authenticated)
 */
router.delete('/:id', validate(idParamSchema, 'params'), notificationController.deleteNotification);

module.exports = router;

