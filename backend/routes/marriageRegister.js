const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { marriageRegisterRules } = require('../validators/marriageRegisterValidator');
const {
  getMarriageRecords,
  getMarriageRecordById,
  createMarriageRecord,
  updateMarriageRecord,
  uploadMarriageDocuments,
  deleteMarriageRecord,
} = require('../controllers/marriageRegisterController');

// Multer storage for marriage docs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `marriage-doc-${Date.now()}-${Math.round(Math.random() * 1e4)}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|pdf|doc|docx/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) return cb(null, true);
  cb(new Error('Invalid file format. Allowed: JPEG, PNG, WebP, PDF, DOC, DOCX'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Admin-only endpoints
router.get('/', protect, adminOnly, getMarriageRecords);
router.get('/:id', protect, adminOnly, getMarriageRecordById);
router.post('/', protect, adminOnly, validate(marriageRegisterRules), createMarriageRecord);
router.put('/:id', protect, adminOnly, validate(marriageRegisterRules), updateMarriageRecord);
router.post('/upload', protect, adminOnly, upload.single('file'), uploadMarriageDocuments);
router.delete('/:id', protect, adminOnly, deleteMarriageRecord);

module.exports = router;
