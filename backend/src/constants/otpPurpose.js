/**
 * OTP purpose types and configuration.
 * Used across otpService and otpRepository.
 */
const OTP_PURPOSE = Object.freeze({
  EMAIL_VERIFICATION: 'email_verification',
  PHONE_VERIFICATION: 'phone_verification',
  PASSWORD_RESET:     'password_reset',
  LOGIN:              'login',
  TRANSACTION:        'transaction',
});

/** OTP expiry in minutes */
const OTP_EXPIRY_MINUTES = 10;

/** Length of generated OTP codes */
const OTP_LENGTH = 6;

/** Max verification attempts before OTP is invalidated */
const OTP_MAX_ATTEMPTS = 5;

/** OTP resend cooldown in seconds */
const OTP_RESEND_COOLDOWN = 60;

module.exports = { OTP_PURPOSE, OTP_EXPIRY_MINUTES, OTP_MAX_ATTEMPTS, OTP_RESEND_COOLDOWN };
