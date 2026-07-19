const express = require('express');
const router = express.Router();
const shortlistController = require('../controllers/shortlist/shortlist.controller');
const verifyToken = require('../middlewares/auth/verifyToken');
const { validate, shortlistActionSchema } = require('../validators/shortlist.validator');

// Protect all shortlist/bookmarks endpoints
router.use(verifyToken);

/**
 * @route   POST /api/v1/shortlist
 * @desc    Add a profile user to the user's shortlist
 * @access  Private (Authenticated)
 */
router.post(
  '/',
  validate(shortlistActionSchema, 'body'),
  shortlistController.addToShortlist
);

/**
 * @route   DELETE /api/v1/shortlist/:id
 * @desc    Remove a profile user from the user's shortlist
 * @access  Private (Authenticated)
 */
router.delete('/:id', shortlistController.removeFromShortlist);

/**
 * @route   GET /api/v1/shortlist
 * @desc    List all shortlisted profiles for the logged-in user
 * @access  Private (Authenticated)
 */
router.get('/', shortlistController.getShortlist);

module.exports = router;

