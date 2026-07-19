const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search/search.controller');
const verifyToken = require('../middlewares/auth/verifyToken');
const { validate, searchQuerySchema } = require('../validators/search.validator');

// Protect search endpoint
router.use(verifyToken);

/**
 * @route   GET /api/v1/search
 * @desc    Search matching user profiles with pagination and filters
 * @access  Private (Authenticated)
 */
router.get('/', validate(searchQuerySchema, 'query'), searchController.searchProfiles);

module.exports = router;

