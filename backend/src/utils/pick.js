/**
 * Picks only the specified keys from an object.
 * Used to cleanly extract query/body params for service calls.
 *
 * @param {Object} obj - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {Object} New object with only specified keys
 *
 * @example
 * pick(req.query, ['page', 'limit', 'sort']) // { page: '1', limit: '10' }
 */
const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

module.exports = pick;
