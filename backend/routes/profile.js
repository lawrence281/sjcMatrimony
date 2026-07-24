const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { sectionParam, SECTION_RULES } = require('../validators/profileValidator');
const {
  getMyProfile,
  updateProfileSection,
  uploadPhoto,
  addGalleryPhoto,
  removeGalleryPhoto,
  uploadDocument,
  removeDocument,
  getProfileCompletion,
  adminUpdateProfile,
  getAllProfiles,
  createProfileAdmin,
} = require('../controllers/profileController');

// ─────────────────────────────────────────────
// Multer configuration for profile uploads
// ─────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) return cb(null, true);
  cb(new Error('Only JPEG, PNG, or WebP images are allowed'));
};

const docFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|pdf/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) return cb(null, true);
  cb(new Error('Only JPEG, PNG, WebP, or PDF files are allowed'));
};

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `profile-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`),
});

const docStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `doc-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`),
});

const photoUpload = multer({
  storage: photoStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('photo');

const docUpload = multer({
  storage: docStorage,
  fileFilter: docFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).single('document');

// Multer error handler wrapper
const handleUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// ─────────────────────────────────────────────
// Dynamic section validation middleware
// ─────────────────────────────────────────────
const validateSection = (req, res, next) => {
  const sectionRules = SECTION_RULES[req.params.section];
  if (sectionRules && sectionRules.length > 0) {
    return validate(sectionRules)(req, res, next);
  }
  next();
};

// ─────────────────────────────────────────────
// User routes (all require authentication)
// ─────────────────────────────────────────────

// GET    /api/profile/me            — get own profile
router.get('/me', protect, getMyProfile);

// GET    /api/profile/me/completion — completion breakdown
router.get('/me/completion', protect, getProfileCompletion);

// PATCH  /api/profile/me/:section   — update one section
router.patch('/me/:section', protect, validate(sectionParam), validateSection, updateProfileSection);

// POST   /api/profile/me/photo      — upload profile / cover photo
router.post('/me/photo', protect, handleUpload(photoUpload), uploadPhoto);

// POST   /api/profile/me/gallery    — add gallery photo
router.post('/me/gallery', protect, handleUpload(photoUpload), addGalleryPhoto);

// DELETE /api/profile/me/gallery/:photoId
router.delete('/me/gallery/:photoId', protect, removeGalleryPhoto);

// POST   /api/profile/me/documents  — upload a document
router.post('/me/documents', protect, handleUpload(docUpload), uploadDocument);

// DELETE /api/profile/me/documents/:docId
router.delete('/me/documents/:docId', protect, removeDocument);

// ─────────────────────────────────────────────
// Admin routes
// ─────────────────────────────────────────────

// GET    /api/profile/all           — all profiles (paginated)
router.get('/all', protect, adminOnly, getAllProfiles);

// POST   /api/profile/admin/create  — create new profile from admin
router.post('/admin/create', protect, adminOnly, createProfileAdmin);

// PATCH  /api/profile/:id/admin     — update any fields
router.patch('/:id/admin', protect, adminOnly, adminUpdateProfile);

module.exports = router;
