const multer = require('multer');
const path = require('path');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');

/** Allowed MIME types per upload category */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;    // 5 MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Uses memory storage — files are held in buffer before Cloudinary upload.
 * Avoids writing to disk on the server.
 */
const storage = multer.memoryStorage();

/**
 * Creates a multer file filter for the given allowed types.
 * @param {string[]} allowedTypes
 */
const createFileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        STATUS.BAD_REQUEST,
        `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
      ),
      false
    );
  }
};

/** Multer instance for profile/gallery images */
const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: createFileFilter(ALLOWED_IMAGE_TYPES),
});

/** Multer instance for documents (PDF / image) */
const uploadDocument = multer({
  storage,
  limits: { fileSize: MAX_DOCUMENT_SIZE },
  fileFilter: createFileFilter(ALLOWED_DOCUMENT_TYPES),
});

module.exports = { uploadImage, uploadDocument };
