const { cloudinary } = require('../../config/cloudinary');
const galleryRepository = require('../../repositories/gallery.repository');
const profileRepository = require('../../repositories/profile.repository');
const AdminSetting = require('../../models/AdminSetting.model');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { Readable } = require('stream');

/**
 * Uploads a file buffer to Cloudinary using a readable stream.
 *
 * @param {Buffer} fileBuffer
 * @param {string} folder
 * @returns {Promise<Object>} Cloudinary API response
 */
const uploadToCloudinary = (fileBuffer, folder = 'matrimony') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    const readable = new Readable();
    readable._read = () => {};
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Gallery Service
 * Manages photo uploads, primary profile pictures, and media deletion.
 */
const galleryService = {
  /**
   * Uploads an image to Cloudinary and registers it in the gallery.
   *
   * @param {string} userId - Requesting User ID
   * @param {Buffer} fileBuffer - Image buffer
   * @param {string} [caption] - Image note
   * @param {boolean} [isPrimary] - Whether to set as profile primary picture
   * @returns {Promise<Object>} Created gallery item
   */
  async uploadImage(userId, fileBuffer, caption = null, isPrimary = false) {
    // 1. Verify user profile exists
    const profile = await profileRepository.findByUserId(userId, false); // not lean, need mongoose doc to save
    if (!profile) {
      throw new ApiError(STATUS.BAD_REQUEST, 'You must create a profile before uploading photos.');
    }

    // 2. Fetch gallery upload limit configuration
    const maxSetting = await AdminSetting.findOne({ key: 'max_gallery_images' });
    const maxImages = maxSetting ? parseInt(maxSetting.value, 10) : 10;

    // Check count limit
    const currentCount = await galleryRepository.count({ profileId: profile._id });
    if (currentCount >= maxImages) {
      throw new ApiError(STATUS.BAD_REQUEST, `Gallery upload limit exceeded. Maximum allowed: ${maxImages} images.`);
    }

    // 3. Upload image buffer to Cloudinary
    let result;
    try {
      result = await uploadToCloudinary(fileBuffer, 'gallery');
    } catch (uploadError) {
      throw new ApiError(STATUS.SERVER_ERROR, `Cloudinary upload failed: ${uploadError.message}`);
    }

    // 4. Update primary photo configurations if needed
    if (isPrimary) {
      await galleryRepository.clearPrimaryFlag(profile._id);
      profile.profilePicture = result.secure_url;
      await profile.save();
    }

    // 5. Create database record
    return galleryRepository.create({
      profileId: profile._id,
      userId,
      imageUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      isPrimary,
      isApproved: true,
      caption,
    });
  },

  /**
   * Deletes a photo from Cloudinary and database registry.
   *
   * @param {string} userId
   * @param {string} imageId
   * @returns {Promise<Object>} Deletion result
   */
  async deleteImage(userId, imageId) {
    const image = await galleryRepository.findById(imageId);
    if (!image) {
      throw new ApiError(STATUS.NOT_FOUND, 'Image not found.');
    }

    // Authorization: User can only delete their own image
    if (image.userId.toString() !== userId.toString()) {
      throw new ApiError(STATUS.FORBIDDEN, 'Insufficient permissions.');
    }

    // 1. Delete image from Cloudinary
    try {
      await cloudinary.uploader.destroy(image.cloudinaryPublicId);
    } catch (error) {
      // Log error but continue database cleanup if file is already deleted/missing on Cloudinary
      const logger = require('../../utils/logger');
      logger.warn(`Failed to destroy image on Cloudinary: ${error.message}`);
    }

    // 2. Remove database reference
    await galleryRepository.deleteById(imageId);

    // 3. If deleted image was primary, reset profile picture URL
    if (image.isPrimary) {
      const profile = await profileRepository.findByUserId(userId, false);
      if (profile) {
        profile.profilePicture = null;
        await profile.save();
      }
    }

    return { message: 'Photo deleted successfully.' };
  },

  /**
   * Toggles an image to be the primary profile picture.
   *
   * @param {string} userId
   * @param {string} imageId
   * @returns {Promise<Object>} Updated image element
   */
  async setPrimary(userId, imageId) {
    const image = await galleryRepository.findById(imageId);
    if (!image) {
      throw new ApiError(STATUS.NOT_FOUND, 'Image not found.');
    }

    if (image.userId.toString() !== userId.toString()) {
      throw new ApiError(STATUS.FORBIDDEN, 'Insufficient permissions.');
    }

    // Clear existing primary flag in user's gallery
    await galleryRepository.clearPrimaryFlag(image.profileId);

    // Set new primary image
    const updatedImage = await galleryRepository.updateById(imageId, { isPrimary: true });

    // Update Profile picture URL
    const profile = await profileRepository.findByUserId(userId, false);
    if (profile) {
      profile.profilePicture = image.imageUrl;
      await profile.save();
    }

    return updatedImage;
  },

  /**
   * Retrieves all photos in a user's gallery.
   *
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getGalleryByUserId(userId) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw new ApiError(STATUS.NOT_FOUND, 'Profile not found.');
    }

    return galleryRepository.findProfileGallery(profile._id);
  },
};

module.exports = galleryService;
