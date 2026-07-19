const { appEvents, APP_EVENTS } = require('../eventEmitter');
const logger = require('../../utils/logger');

/**
 * Notification event listener.
 * Listens to domain events and creates in-app notifications.
 * The actual notification creation is handled by notificationService.
 *
 * This file is imported once at app startup to register all listeners.
 */
const registerNotificationListeners = () => {
  appEvents.on(APP_EVENTS.INTEREST_SENT, async ({ senderId, receiverId, senderProfile }) => {
    try {
      const notificationService = require('../../services/notification/notification.service');
      await notificationService.create({
        recipientId: receiverId,
        type: 'interest_received',
        title: 'New Interest Received!',
        body: `${senderProfile?.firstName || 'Someone'} has sent you an interest.`,
        data: { senderId, profileId: senderProfile?.profileId },
      });
    } catch (error) {
      logger.error(`Notification listener error [${APP_EVENTS.INTEREST_SENT}]: ${error.message}`);
    }
  });

  appEvents.on(APP_EVENTS.INTEREST_ACCEPTED, async ({ senderId, receiverId, receiverProfile }) => {
    try {
      const notificationService = require('../../services/notification/notification.service');
      await notificationService.create({
        recipientId: senderId,
        type: 'interest_accepted',
        title: 'Interest Accepted!',
        body: `${receiverProfile?.firstName || 'Someone'} accepted your interest.`,
        data: { receiverId, profileId: receiverProfile?.profileId },
      });
    } catch (error) {
      logger.error(`Notification listener error [${APP_EVENTS.INTEREST_ACCEPTED}]: ${error.message}`);
    }
  });

  appEvents.on(APP_EVENTS.PROFILE_APPROVED, async ({ userId }) => {
    try {
      const notificationService = require('../../services/notification/notification.service');
      await notificationService.create({
        recipientId: userId,
        type: 'profile_approved',
        title: 'Profile Approved!',
        body: 'Your profile has been approved. You can now connect with matches.',
        data: {},
      });
    } catch (error) {
      logger.error(`Notification listener error [${APP_EVENTS.PROFILE_APPROVED}]: ${error.message}`);
    }
  });

  appEvents.on(APP_EVENTS.SUBSCRIPTION_ACTIVATED, async ({ userId, planName }) => {
    try {
      const notificationService = require('../../services/notification/notification.service');
      await notificationService.create({
        recipientId: userId,
        type: 'subscription_activated',
        title: 'Subscription Activated!',
        body: `Your ${planName} plan is now active. Enjoy premium features.`,
        data: {},
      });
    } catch (error) {
      logger.error(`Notification listener error [${APP_EVENTS.SUBSCRIPTION_ACTIVATED}]: ${error.message}`);
    }
  });

  logger.info('Notification event listeners registered.');
};

module.exports = registerNotificationListeners;
