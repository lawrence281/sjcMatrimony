const galleryService = require('../../services/gallery/gallery.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');
const ApiError = require('../../utils/ApiError');
const { STATUS: ERROR } = require('../../statusCodes/error');

/**
 * Gallery Controller
 * Manages photo uploads and profile picture selections.
 */
const galleryController = {
  /**
   * POST /gallery
   * Uploads an image to the profile gallery.
   */
  uploadImage: catchAsync(async (req, res) => {
    if (!req.file) {
      throw new ApiError(ERROR.BAD_REQUEST, 'Please upload an image file.');
    }

    const { caption, isPrimary } = req.body;
    const isPrimaryBool = isPrimary === 'true' || isPrimary === true;

    const image = await galleryService.uploadImage(
      req.user._id,
      req.file.buffer,
      caption,
      isPrimaryBool
    );

    sendSuccess(res, SUCCESS.CREATED, 'Photo uploaded successfully.', { image });
  }),

  /**
   * DELETE /gallery/:id
   * Removes a photo from the gallery and Cloudinary.
   */
  deleteImage: catchAsync(async (req, res) => {
    const result = await galleryService.deleteImage(req.user._id, req.params.id);
    sendSuccess(res, SUCCESS.OK, result.message);
  }),

  /**
   * PATCH /gallery/:id/primary
   * Sets a photo as the primary profile picture.
   */
  setPrimary: catchAsync(async (req, res) => {
    const image = await galleryService.setPrimary(req.user._id, req.params.id);
    sendSuccess(res, SUCCESS.OK, 'Profile picture updated successfully.', { image });
  }),

  /**
   * GET /gallery
   * Retrieves all photos in the logged-in user's gallery.
   */
  getGallery: catchAsync(async (req, res) => {
    const gallery = await galleryService.getGalleryByUserId(req.user._id);
    sendSuccess(res, SUCCESS.OK, 'Gallery retrieved successfully.', gallery);
  }),
};

module.exports = galleryController;
