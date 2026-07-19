const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report/report.controller');
const verifyToken = require('../middlewares/auth/verifyToken');
const { validate, createReportSchema } = require('../validators/report.validator');

// Protect all client-facing reporting endpoints
router.use(verifyToken);

/**
 * @route   POST /api/v1/reports
 * @desc    File a report on a user
 * @access  Private (Authenticated)
 */
router.post('/', validate(createReportSchema, 'body'), reportController.createReport);

module.exports = router;

