const express = require('express');
const router = express.Router();
const { analyze } = require('../controllers/aiController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/analyze', protect, adminOnly, analyze);

module.exports = router;
