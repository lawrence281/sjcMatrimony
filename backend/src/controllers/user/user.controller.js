const userService = require('../../services/user/user.service');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { sendSuccess } = require('../../helpers/response.helper');
const { USER_MESSAGES } = require('../../messages/userMessages');
const { AUTH_MESSAGES } = require('../../messages/authMessages');
const { STATUS: SUCCESS } = require('../../statusCodes/success');
const { STATUS: ERROR } = require('../../statusCodes/error');
const { ADMIN_ROLES } = require('../../constants/roles');

/**
 * User Controller
 * Routes HTTP requests to UserService and sends standardized JSON responses.
 */
const userController = {
  /**
   * GET /users
   * Retrieves a paginated list of users (Admin only).
   */
  listUsers: catchAsync(async (req, res) => {
    const result = await userService.listUsers(req.query);

    sendSuccess(
      res,
      SUCCESS.OK,
      USER_MESSAGES.USERS_FETCHED,
      result.users,
      {
        total: result.total,
        page: result.page,
        limit: result.limit,
      }
    );
  }),

  /**
   * GET /users/:id
   * Retrieves a user by ID (Self or Admin).
   */
  getUserById: catchAsync(async (req, res) => {
    const isSelf = req.user._id === req.params.id;
    const isAdmin = ADMIN_ROLES.includes(req.user.role);

    // Only self or admins/employees can read the full user resource details
    if (!isSelf && !isAdmin) {
      throw new ApiError(ERROR.FORBIDDEN, AUTH_MESSAGES.FORBIDDEN || 'Insufficient permissions.');
    }

    const user = await userService.getUserById(req.params.id);

    sendSuccess(res, SUCCESS.OK, USER_MESSAGES.USER_FETCHED, { user });
  }),

  /**
   * PATCH /users/:id
   * Updates user details (Self or Admin with restricted fields).
   */
  updateUser: catchAsync(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body, req.user);

    sendSuccess(res, SUCCESS.OK, USER_MESSAGES.USER_UPDATED, { user });
  }),

  /**
   * DELETE /users/:id
   * Deletes a user by ID (Admin only).
   */
  deleteUser: catchAsync(async (req, res) => {
    const result = await userService.deleteUser(req.params.id, req.user);

    sendSuccess(res, SUCCESS.OK, result.message);
  }),
};

module.exports = userController;
