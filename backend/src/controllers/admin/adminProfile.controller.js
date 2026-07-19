const adminProfileService = require('../../services/admin/adminProfile.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');
const { ADMIN_MESSAGES } = require('../../messages/adminMessages');

/**
 * Admin Profile Controller
 * Maps administrative profile moderation controls.
 */
const adminProfileController = {
  /**
   * GET /admin/profiles
   * Lists and searches user profiles.
   */
  listProfiles: catchAsync(async (req, res) => {
    const result = await adminProfileService.listProfiles(req.query);
    sendSuccess(res, SUCCESS.OK, 'Profiles retrieved successfully.', result.profiles, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  }),

  /**
   * PATCH /admin/profiles/:id/approve
   * Approves profile user.
   */
  approveProfile: catchAsync(async (req, res) => {
    const profile = await adminProfileService.approveProfile(req.params.id, req.user._id);
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.PROFILE_APPROVED, { profile });
  }),

  /**
   * PATCH /admin/profiles/:id/reject
   * Rejects profile user.
   */
  rejectProfile: catchAsync(async (req, res) => {
    const profile = await adminProfileService.rejectProfile(
      req.params.id,
      req.body,
      req.user._id
    );
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.PROFILE_REJECTED, { profile });
  }),

  /**
   * PATCH /admin/profiles/:id/suspend
   * Suspends profile user.
   */
  suspendProfile: catchAsync(async (req, res) => {
    const profile = await adminProfileService.suspendProfile(
      req.params.id,
      req.body,
      req.user._id
    );
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.PROFILE_SUSPENDED, { profile });
  }),
};

module.exports = adminProfileController;
