const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile/profile.controller');
const verifyToken = require('../middlewares/auth/verifyToken');
const {
  validate,
  createProfileSchema,
  updateProfileSchema,
} = require('../validators/profile.validator');

// Protect all profile endpoints
router.use(verifyToken);

/**
 * @route   POST /api/v1/profiles
 * @desc    Create user profile
 * @access  Private (Authenticated)
 */
router.post(
  '/',
  validate(createProfileSchema, 'body'),
  profileController.createProfile
);

/**
 * @route   GET /api/v1/profiles/me
 * @desc    Get logged-in user profile
 * @access  Private (Authenticated)
 */
router.get('/me', profileController.getMyProfile);

/**
 * @route   GET /api/v1/profiles/me/preferences
 * @desc    Get partner preference configurations
 * @access  Private (Authenticated)
 */
router.get('/me/preferences', profileController.getPartnerPreferences);

/**
 * @route   PUT /api/v1/profiles/me/preferences
 * @desc    Update partner preference configurations
 * @access  Private (Authenticated)
 */
router.put('/me/preferences', profileController.updatePartnerPreferences);

/**
 * @route   POST /api/v1/profiles/me/picture
 * @desc    Upload profile picture
 * @access  Private (Authenticated)
 */
const { uploadImage } = require('../middlewares/upload/multer.middleware');
router.post('/me/picture', uploadImage.single('image'), profileController.uploadProfilePicture);

/**
 * @route   GET /api/v1/profiles/:id
 * @desc    Get user profile by display ID (MAT-XXXXX) or model ObjectId
 * @access  Private (Authenticated)
 */
router.get('/:id', profileController.getProfileById);

/**
 * @route   PUT /api/v1/profiles/me
 * @desc    Update logged-in user profile
 * @access  Private (Authenticated)
 */
router.put(
  '/me',
  validate(updateProfileSchema, 'body'),
  profileController.updateMyProfile
);

module.exports = router;

