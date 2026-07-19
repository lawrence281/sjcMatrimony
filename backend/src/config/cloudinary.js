const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

/**
 * Configures the Cloudinary SDK using environment variables.
 * Called once at application startup.
 */
const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    logger.warn('Cloudinary credentials are incomplete. File uploads will not work.');
    return;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  logger.info('Cloudinary configured successfully.');
};

module.exports = { cloudinary, configureCloudinary };
