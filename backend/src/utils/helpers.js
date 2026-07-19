/**
 * Calculates exact age in years from a date of birth.
 * @param {Date|string} dob - Date of birth
 * @returns {number} Age in years
 */
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

/**
 * Generates a unique profile ID in the format MAT-XXXXX.
 * @param {number} counter - Sequential counter from DB
 * @returns {string} Profile ID
 */
const generateProfileId = (counter) => {
  return `MAT-${String(counter).padStart(5, '0')}`;
};

/**
 * Generates a random alphanumeric token.
 * @param {number} length - Token length
 * @returns {string} Random token
 */
const generateToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

module.exports = { calculateAge, generateProfileId, generateToken };
