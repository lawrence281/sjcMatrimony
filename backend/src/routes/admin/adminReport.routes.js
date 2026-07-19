const express = require('express');
const router = express.Router();
const adminReportController = require('../../controllers/admin/adminReport.controller');
const { hasPermission } = require('../../middlewares/auth/hasPermission');
const { ROLES } = require('../../constants/roles');
const {
  validate,
  idParamSchema,
  resolveReportSchema,
  listReportsSchema,
} = require('../../validators/report.validator');

/**
 * @route   GET /api/v1/admin/reports
 * @desc    List abuse reports filed by users (All admin roles)
 * @access  Private (Admin)
 */
router.get('/', validate(listReportsSchema, 'query'), adminReportController.listReports);

/**
 * @route   PATCH /api/v1/admin/reports/:id/resolve
 * @desc    Resolve or dismiss an abuse report (Super Admin / Admin only)
 * @access  Private (Super Admin / Admin)
 */
router.patch(
  '/:id/resolve',
  hasPermission(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  validate(resolveReportSchema, 'body'),
  adminReportController.resolveReport
);

module.exports = router;
