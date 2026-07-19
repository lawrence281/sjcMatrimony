/**
 * Shared regex patterns for validation.
 * Centralised here to keep validators DRY.
 */
const REGEX = Object.freeze({
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE_IN: /^[6-9]\d{9}$/,        // Indian mobile numbers
  PHONE_INTL: /^\+[1-9]\d{1,14}$/, // E.164 international format
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  OTP: /^\d{6}$/,
  PROFILE_ID: /^MAT-\d{5,}$/,
  MONGO_ID: /^[a-f\d]{24}$/i,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  ONLY_ALPHA: /^[a-zA-Z\s]+$/,
  NO_SPECIAL_CHARS: /^[a-zA-Z0-9\s]+$/,
});

module.exports = { REGEX };
