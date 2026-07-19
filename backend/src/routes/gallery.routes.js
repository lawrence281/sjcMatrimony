const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery/gallery.controller');
const verifyToken = require('../middlewares/auth/verifyToken');
const { uploadImage } = require('../middlewares/upload/multer.middleware');
const { validate, idParamSchema } = require('../validators/gallery.validator');

// Protect all profile gallery endpoints
router.use(verifyToken);

/**
 * @route   GET /api/v1/gallery
 * @desc    Get all photos in current user's gallery
 * @access  Private (Authenticated)
 */
router.get('/', galleryController.getGallery);

/**
 * @route   POST /api/v1/gallery
 * @desc    Upload image to gallery
 * @access  Private (Authenticated)
 */
router.post('/', uploadImage.single('image'), galleryController.uploadImage);

/**
 * @route   PATCH /api/v1/gallery/:id/primary
 * @desc    Set image as primary profile photo
 * @access  Private (Authenticated)
 */
router.patch(
  '/:id/primary',
  validate(idParamSchema, 'params'),
  galleryController.setPrimary
);

/**
 * @route   DELETE /api/v1/gallery/:id
 * @desc    Remove photo from gallery and Cloudinary
 * @access  Private (Authenticated)
 */
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  galleryController.deleteImage
);

module.exports = router;

