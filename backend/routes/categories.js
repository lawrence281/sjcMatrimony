const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getCategories, createCategory, updateCategory, toggleCategoryStatus } = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `category-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getCategories);
router.post('/', protect, adminOnly, upload.single('image'), createCategory);
router.put('/:id', protect, adminOnly, upload.single('image'), updateCategory);
router.patch('/:id/toggle', protect, adminOnly, toggleCategoryStatus);

module.exports = router;
