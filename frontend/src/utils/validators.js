/**
 * Client-side validation helper functions.
 * Kept in sync with backend Joi validation schemas.
 */

export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[6-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

/**
 * Validates email structure.
 * @param {string} email
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email) return 'Email is required.';
  if (!REGEX.EMAIL.test(email)) return 'Please enter a valid email address.';
  return null;
};

/**
 * Validates Indian phone numbers.
 * @param {string} phone
 * @returns {string|null} Error message or null if valid
 */
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required.';
  if (!REGEX.PHONE.test(phone)) return 'Please enter a valid 10-digit mobile number.';
  return null;
};

/**
 * Validates password strength.
 * @param {string} password
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (!REGEX.PASSWORD.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
  }
  return null;
};
