const adminClientProfileService = require('../../services/admin/adminClientProfile.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');
const { ADMIN_MESSAGES } = require('../../messages/adminMessages');

/**
 * Admin Client Profile Controller
 * ─────────────────────────────────────────────────────────────────────────────
 * HTTP handler layer for admin-initiated matrimony client profile management.
 * Each handler delegates all logic to adminClientProfileService.
 *
 * Routes:
 *   GET    /api/v1/admin/client-profiles
 *   POST   /api/v1/admin/client-profiles
 *   GET    /api/v1/admin/client-profiles/:id
 *   PATCH  /api/v1/admin/client-profiles/:id
 *   DELETE /api/v1/admin/client-profiles/:id
 */
const adminClientProfileController = {
  /**
   * GET /api/v1/admin/client-profiles
   * Lists all client profiles with pagination and filters.
   */
  listClientProfiles: catchAsync(async (req, res) => {
    const result = await adminClientProfileService.listClientProfiles(req.query);
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.CLIENT_PROFILES_FETCHED, result.profiles, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  }),

  /**
   * POST /api/v1/admin/client-profiles
   * Creates a new client User account + Profile.
   * Triggers async WhatsApp onboarding message after successful DB save.
   */
  createClientProfile: catchAsync(async (req, res) => {
    const result = await adminClientProfileService.createClientProfile(req.body, req.user._id);
    sendSuccess(
      res,
      SUCCESS.CREATED,
      ADMIN_MESSAGES.CLIENT_PROFILE_CREATED,
      { user: result.user, profile: result.profile },
      { whatsapp: result.whatsapp }
    );
  }),

  /**
   * GET /api/v1/admin/client-profiles/:id
   * Retrieves a single client profile by Profile ObjectId.
   */
  getClientProfileById: catchAsync(async (req, res) => {
    const profile = await adminClientProfileService.getClientProfileById(req.params.id);
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.CLIENT_PROFILE_FETCHED, { profile });
  }),

  /**
   * PATCH /api/v1/admin/client-profiles/:id
   * Updates an existing client profile (profile fields and/or user fields).
   */
  updateClientProfile: catchAsync(async (req, res) => {
    const profile = await adminClientProfileService.updateClientProfile(
      req.params.id,
      req.body,
      req.user._id
    );
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.CLIENT_PROFILE_UPDATED, { profile });
  }),

  /**
   * DELETE /api/v1/admin/client-profiles/:id
   * Soft-deletes a client profile and deactivates the linked user account.
   */
  deleteClientProfile: catchAsync(async (req, res) => {
    const result = await adminClientProfileService.deleteClientProfile(
      req.params.id,
      req.user._id
    );
    sendSuccess(res, SUCCESS.OK, result.message);
  }),
};

module.exports = adminClientProfileController;
