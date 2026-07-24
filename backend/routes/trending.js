const express = require('express');
const Trending = require('../models/Trending');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Absolute path to uploads folder — always inside backend/uploads, never in src
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'trending');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `showcase-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB to support larger videos
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpeg|jpg|png|webp|gif|mp4|webm|ogv|mov)$/i;
    if (allowed.test(path.extname(file.originalname))) return cb(null, true);
    cb(new Error('Only images (jpg, png, webp, gif) and videos (mp4, webm, mov) are allowed!'));
  }
});

// Public: Get active trending items
router.get('/', async (req, res) => {
  try {
    const items = await Trending.find({ isActive: true }).sort({ order: 1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all trending items
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    const items = await Trending.find().sort({ order: 1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Add (create) showcase item
router.post('/', protect, adminOnly, upload.single('mediaFile'), async (req, res) => {
  try {
    const itemData = { ...req.body };
    if (req.file) {
      // Store only the URL path, not the physical file path
      itemData.mediaUrl = `/uploads/trending/${req.file.filename}`;
      itemData.mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    }
    if (!itemData.mediaUrl) {
      return res.status(400).json({ message: 'Either upload a file or provide a media URL' });
    }
    const item = new Trending(itemData);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Update showcase item
router.put('/:id', protect, adminOnly, upload.single('mediaFile'), async (req, res) => {
  try {
    const itemData = { ...req.body };
    if (req.file) {
      // If replacing a locally-stored file, delete the old one to avoid orphans
      const existing = await Trending.findById(req.params.id);
      if (existing?.mediaUrl?.startsWith('/uploads/')) {
        const oldFilePath = path.join(__dirname, '..', existing.mediaUrl);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      itemData.mediaUrl = `/uploads/trending/${req.file.filename}`;
      itemData.mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    }
    const item = await Trending.findByIdAndUpdate(req.params.id, itemData, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete showcase item
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await Trending.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    // Clean up the physical file if it was locally uploaded
    if (item.mediaUrl?.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', item.mediaUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    
    await Trending.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
