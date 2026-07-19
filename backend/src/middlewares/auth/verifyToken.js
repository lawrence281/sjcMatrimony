const jwt = require('jsonwebtoken');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { JWT_CONFIG } = require('../../constants/jwtConfig');
const { AUTH_MESSAGES } = require('../../messages/authMessages');
const { STATUS } = require('../../statusCodes/error');

/**
 * Verifies the JWT access token from the Authorization header.
 * Attaches the decoded payload to req.user on success.
 *
 * Expects: Authorization: Bearer <token>
 */
const verifyToken = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(STATUS.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new ApiError(STATUS.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(STATUS.UNAUTHORIZED, AUTH_MESSAGES.TOKEN_EXPIRED);
    }
    throw new ApiError(STATUS.UNAUTHORIZED, AUTH_MESSAGES.TOKEN_INVALID);
  }
});

module.exports = verifyToken;
