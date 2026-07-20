const EventEmitter = require('events');

/**
 * Application-wide singleton EventEmitter.
 * Decouples domain actions from side-effects (notifications, emails, SMS).
 *
 * In production, replace with BullMQ or RabbitMQ for:
 * - Guaranteed delivery
 * - Job retries
 * - Cross-process communication
 *
 * Usage:
 *   appEvents.emit(APP_EVENTS.INTEREST_SENT, { senderId, receiverId });
 */
class AppEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50); // Allow multiple listeners per event
  }
}

const appEvents = new AppEventEmitter();

/** All application event names — use constants, never string literals */
const APP_EVENTS = Object.freeze({
  // Auth
  USER_REGISTERED: 'user.registered',
  USER_LOGIN: 'user.login',
  PASSWORD_RESET_REQUESTED: 'user.password_reset_requested',

  // Profile
  PROFILE_APPROVED: 'profile.approved',
  PROFILE_REJECTED: 'profile.rejected',
  PROFILE_VIEWED: 'profile.viewed',

  // Interest
  INTEREST_SENT: 'interest.sent',
  INTEREST_ACCEPTED: 'interest.accepted',
  INTEREST_REJECTED: 'interest.rejected',

  // Subscription
  SUBSCRIPTION_ACTIVATED: 'subscription.activated',
  SUBSCRIPTION_EXPIRING: 'subscription.expiring',
  SUBSCRIPTION_EXPIRED: 'subscription.expired',

  // Payment
  PAYMENT_SUCCESS: 'payment.success',
  PAYMENT_FAILED: 'payment.failed',

  // Chat
  MESSAGE_SENT: 'message.sent',

  // Admin
  REPORT_SUBMITTED: 'report.submitted',

  // Admin — Client Profile Lifecycle
  ADMIN_PROFILE_CREATED: 'admin.profile_created',
  ADMIN_PROFILE_UPDATED: 'admin.profile_updated',
});

module.exports = { appEvents, APP_EVENTS };
