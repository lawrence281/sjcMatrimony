const blockedUserService = require('../../services/blockedUser/blockedUser.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Blocked User Controller
 * Maps request details to BlockedUserService.
 */
const blockedUserController = {
  /**
   * POST /users/block
   * Blocks a user.
   */
  blockUser: catchAsync(async (req, res) => {
    const { blockedUser, reason } = req.body;
    const entry = await blockedUserService.blockUser(req.user._id, blockedUser, reason);
    sendSuccess(res, SUCCESS.CREATED, 'User blocked successfully.', { entry });
  }),

  /**
   * DELETE /users/block/:id
   * Unblocks a user.
   */
  unblockUser: catchAsync(async (req, res) => {
    const result = await blockedUserService.unblockUser(req.user._id, req.params.id);
    sendSuccess(res, SUCCESS.OK, result.message);
  }),

  /**
   * GET /users/block
   * Lists blocked users.
   */
  getBlockList: catchAsync(async (req, res) => {
    const blockList = await blockedUserService.getBlockList(req.user._id);
    sendSuccess(res, SUCCESS.OK, 'Blocked users list retrieved successfully.', blockList);
  }),
};

module.exports = blockedUserController;
