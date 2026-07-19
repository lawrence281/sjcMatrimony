const ApiError = require('../../utils/ApiError');
const { ADMIN_ROLES, CLIENT_ROLES } = require('../../constants/roles');
const { AUTH_MESSAGES } = require('../../messages/authMessages');
const { STATUS } = require('../../statusCodes/error');

/**
 * Role-based access control middleware factory.
 *
 * @param {...string} allowedRoles - Roles permitted to access the route
 * @returns {Function} Express middleware
 *
 * @example
 * // Allow only super_admin and admin
 * router.delete('/user/:id', verifyToken, hasPermission('super_admin', 'admin'), handler)
 */
const hasPermission = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(STATUS.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(STATUS.FORBIDDEN, AUTH_MESSAGES.FORBIDDEN || 'Insufficient permissions.');
    }

    next();
  };
};

/**
 * Convenience middleware: allows any admin-role user.
 */
const isAdminRole = (req, res, next) => {
  if (!req.user || !ADMIN_ROLES.includes(req.user.role)) {
    throw new ApiError(STATUS.FORBIDDEN, 'Admin access required.');
  }
  next();
};

/**
 * Convenience middleware: allows only client-role users.
 */
const isClientRole = (req, res, next) => {
  if (!req.user || !CLIENT_ROLES.includes(req.user.role)) {
    throw new ApiError(STATUS.FORBIDDEN, 'Client access required.');
  }
  next();
};

module.exports = { hasPermission, isAdminRole, isClientRole };
