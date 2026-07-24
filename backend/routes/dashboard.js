const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/analytics', protect, adminOnly, getAnalytics);

module.exports = router;
