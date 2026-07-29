const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { configRules } = require('../validators/configValidator');
const {
  getConfig,
  updateConfig,
  resetConfigToDefault,
  uploadConfigMedia,
} = require('../controllers/configController');

// Multer storage for logo/favicon
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `config-asset-${Date.now()}${path.extname(file.originalname)}`),
});

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|svg|ico/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) return cb(null, true);
  cb(new Error('Only JPEG, PNG, WebP, SVG, or ICO images are allowed'));
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Routes
router.get('/', getConfig);
router.put('/', protect, adminOnly, validate(configRules), updateConfig);
router.post('/reset', protect, adminOnly, resetConfigToDefault);
router.post('/upload', protect, adminOnly, upload.single('media'), uploadConfigMedia);

module.exports = router;
