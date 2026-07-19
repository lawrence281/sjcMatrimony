const adminUserService = require('../../services/admin/adminUser.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { ADMIN_MESSAGES } = require('../../messages/adminMessages');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Admin User Controller
 * Exposes operations to manage staff/employee accounts.
 */
const adminUserController = {
  /**
   * GET /admin/users
   * Lists administrative staff.
   */
  listAdminUsers: catchAsync(async (req, res) => {
    const result = await adminUserService.listAdminUsers(req.query);
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.ADMINS_FETCHED, result.users, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  }),

  /**
   * POST /admin/users
   * Registers a new administrative staff user.
   */
  createAdminUser: catchAsync(async (req, res) => {
    const user = await adminUserService.createAdminUser(req.body, req.user._id);
    sendSuccess(res, SUCCESS.CREATED, ADMIN_MESSAGES.ADMIN_CREATED, { user });
  }),

  /**
   * GET /admin/users/:id
   * Retrieves single administrative staff user details.
   */
  getAdminUserById: catchAsync(async (req, res) => {
    // Reuse the userService getUserById function
    const userService = require('../../services/user/user.service');
    const user = await userService.getUserById(req.params.id);
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.ADMIN_FETCHED, { user });
  }),

  /**
   * PATCH /admin/users/:id
   * Updates staff user parameters.
   */
  updateAdminUser: catchAsync(async (req, res) => {
    const user = await adminUserService.updateAdminUser(req.params.id, req.body);
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.ADMIN_UPDATED, { user });
  }),

  /**
   * PATCH /admin/users/:id/toggle-status
   * Disables or enables a staff account.
   */
  toggleUserStatus: catchAsync(async (req, res) => {
    const user = await adminUserService.toggleUserStatus(req.params.id);
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.ADMIN_UPDATED, { user });
  }),

  /**
   * DELETE /admin/users/:id
   * Removes administrative user (blocks self-deletion).
   */
  deleteAdminUser: catchAsync(async (req, res) => {
    const result = await adminUserService.deleteAdminUser(req.params.id, req.user._id);
    sendSuccess(res, SUCCESS.OK, result.message);
  }),
};

module.exports = adminUserController;
