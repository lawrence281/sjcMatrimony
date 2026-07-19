const profileService = require('../../services/profile/profile.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');
const { PROFILE_STATUS } = require('../../constants/profileStatus');
const { ADMIN_ROLES } = require('../../constants/roles');
const ApiError = require('../../utils/ApiError');
const { STATUS: ERROR } = require('../../statusCodes/error');

/**
 * Profile Controller
 * Maps request inputs to ProfileService.
 */
const profileController = {
  /**
   * POST /profiles
   * Creates a profile for the logged-in user.
   */
  createProfile: catchAsync(async (req, res) => {
    const profile = await profileService.createProfile(req.user._id, req.body);
    sendSuccess(res, SUCCESS.CREATED, 'Profile created successfully.', { profile });
  }),

  /**
   * GET /profiles/me
   * Fetches logged-in user's profile.
   */
  getMyProfile: catchAsync(async (req, res) => {
    const profile = await profileService.getProfileByUserId(req.user._id);
    sendSuccess(res, SUCCESS.OK, 'Profile retrieved successfully.', { profile });
  }),

  /**
   * GET /profiles/:id
   * Fetches a user profile by model ID or MAT profileId.
   */
  getProfileById: catchAsync(async (req, res) => {
    const profile = await profileService.getProfileById(req.params.id);

    // Access control: User can see their own profile, admins can see anything,
    // otherwise profile must be approved or active.
    const isOwner = profile.userId.toString() === req.user._id.toString();
    const isAdmin = ADMIN_ROLES.includes(req.user.role);
    const isVisible =
      profile.status === PROFILE_STATUS.APPROVED || profile.status === PROFILE_STATUS.ACTIVE;

    if (!isOwner && !isAdmin && !isVisible) {
      throw new ApiError(ERROR.FORBIDDEN, 'This profile is not visible.');
    }

    sendSuccess(res, SUCCESS.OK, 'Profile retrieved successfully.', { profile });
  }),

  /**
   * PUT /profiles/me
   * Modifies logged-in user's profile.
   */
  updateMyProfile: catchAsync(async (req, res) => {
    const profile = await profileService.updateProfile(req.user._id, req.body);
    sendSuccess(res, SUCCESS.OK, 'Profile updated successfully.', { profile });
  }),

  /**
   * GET /profiles/me/preferences
   * Fetches partner preference configurations.
   */
  getPartnerPreferences: catchAsync(async (req, res) => {
    const partnerPreferenceService = require('../../services/partnerPreference/partnerPreference.service');
    const preferences = await partnerPreferenceService.getPreferences(req.user._id);
    sendSuccess(res, SUCCESS.OK, 'Preferences retrieved successfully.', preferences);
  }),

  /**
   * PUT /profiles/me/preferences
   * Creates or updates partner preference configurations.
   */
  updatePartnerPreferences: catchAsync(async (req, res) => {
    const partnerPreferenceService = require('../../services/partnerPreference/partnerPreference.service');
    const preferences = await partnerPreferenceService.updatePreferences(req.user._id, req.body);
    sendSuccess(res, SUCCESS.OK, 'Preferences updated successfully.', preferences);
  }),

  /**
   * POST /profiles/me/picture
   * Uploads and updates primary profile image.
   */
  uploadProfilePicture: catchAsync(async (req, res) => {
    if (!req.file) {
      throw new ApiError(ERROR.BAD_REQUEST, 'Please upload an image file.');
    }
    const galleryService = require('../../services/gallery/gallery.service');
    const image = await galleryService.uploadImage(
      req.user._id,
      req.file.buffer,
      'Profile Picture',
      true
    );
    sendSuccess(res, SUCCESS.CREATED, 'Profile picture uploaded successfully.', { image });
  }),
};

module.exports = profileController;
