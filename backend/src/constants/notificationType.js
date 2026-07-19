const NOTIFICATION_TYPE = Object.freeze({
  INTEREST_RECEIVED: 'interest_received',
  INTEREST_ACCEPTED: 'interest_accepted',
  INTEREST_REJECTED: 'interest_rejected',
  PROFILE_SHORTLISTED: 'profile_shortlisted',
  PROFILE_VIEWED: 'profile_viewed',
  MESSAGE_RECEIVED: 'message_received',
  SUBSCRIPTION_ACTIVATED: 'subscription_activated',
  SUBSCRIPTION_EXPIRING: 'subscription_expiring',
  SUBSCRIPTION_EXPIRED: 'subscription_expired',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  PROFILE_APPROVED: 'profile_approved',
  PROFILE_REJECTED: 'profile_rejected',
  PROFILE_SUSPENDED: 'profile_suspended',
  OTP_SENT: 'otp_sent',
  SYSTEM: 'system',
});

module.exports = { NOTIFICATION_TYPE };
