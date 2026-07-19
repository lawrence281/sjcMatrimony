const express = require('express');
const router = express.Router();
const adminSettingController = require('../../controllers/admin/adminSetting.controller');
const { hasPermission } = require('../../middlewares/auth/hasPermission');
const { ROLES } = require('../../constants/roles');
const { validate, updateSettingSchema } = require('../../validators/admin.validator');

/**
 * @route   GET /api/v1/admin/settings
 * @desc    Get all platform settings (All admin roles)
 * @access  Private (Admin)
 */
router.get('/', adminSettingController.getSettings);

/**
 * @route   PUT /api/v1/admin/settings/:key
 * @desc    Update setting by key (Super Admin / Admin only)
 * @access  Private (Super Admin / Admin)
 */
router.put(
  '/:key',
  hasPermission(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(updateSettingSchema, 'body'),
  adminSettingController.updateSetting
);

module.exports = router;

