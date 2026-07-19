const express = require('express');
const router = express.Router();
const adminProfileController = require('../../controllers/admin/adminProfile.controller');
const { hasPermission } = require('../../middlewares/auth/hasPermission');
const { ROLES } = require('../../constants/roles');
const {
  validate,
  idParamSchema,
  rejectProfileSchema,
  suspendProfileSchema,
} = require('../../validators/adminProfile.validator');

/**
 * @route   GET /api/v1/admin/profiles
 * @desc    Get all profiles (All admin roles)
 * @access  Private (Admin)
 */
router.get('/', adminProfileController.listProfiles);

/**
 * @route   PATCH /api/v1/admin/profiles/:id/approve
 * @desc    Approve user profile (Super Admin / Admin only)
 * @access  Private (Super Admin / Admin)
 */
router.patch(
  '/:id/approve',
  hasPermission(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  adminProfileController.approveProfile
);

/**
 * @route   PATCH /api/v1/admin/profiles/:id/reject
 * @desc    Reject user profile (Super Admin / Admin only)
 * @access  Private (Super Admin / Admin)
 */
router.patch(
  '/:id/reject',
  hasPermission(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  validate(rejectProfileSchema, 'body'),
  adminProfileController.rejectProfile
);

/**
 * @route   PATCH /api/v1/admin/profiles/:id/suspend
 * @desc    Suspend user profile (Super Admin / Admin only)
 * @access  Private (Super Admin / Admin)
 */
router.patch(
  '/:id/suspend',
  hasPermission(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  validate(suspendProfileSchema, 'body'),
  adminProfileController.suspendProfile
);

module.exports = router;
