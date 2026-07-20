const express = require('express');
const router = express.Router();
const adminClientProfileController = require('../../controllers/admin/adminClientProfile.controller');
const { hasPermission } = require('../../middlewares/auth/hasPermission');
const { ROLES } = require('../../constants/roles');
const {
  validate,
  idParamSchema,
  createClientProfileSchema,
  updateClientProfileSchema,
  listClientProfilesSchema,
} = require('../../validators/adminClientProfile.validator');

/**
 * Admin Client Profile Routes
 * Prefix: /api/v1/admin/client-profiles
 *
 * Access control:
 *  • List / Read / Update → any admin role (inherited from admin/index.js guard)
 *  • Create / Delete      → Super Admin and Admin only
 */

/**
 * @route   GET /api/v1/admin/client-profiles
 * @desc    List all client profiles (paginated, filterable)
 * @access  Private (All Admin Roles)
 */
router.get(
  '/',
  validate(listClientProfilesSchema, 'query'),
  adminClientProfileController.listClientProfiles
);

/**
 * @route   POST /api/v1/admin/client-profiles
 * @desc    Create a new client User + Profile (triggers WhatsApp onboarding)
 * @access  Private (Super Admin, Admin)
 */
router.post(
  '/',
  hasPermission(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(createClientProfileSchema, 'body'),
  adminClientProfileController.createClientProfile
);

/**
 * @route   GET /api/v1/admin/client-profiles/:id
 * @desc    Get a single client profile by ID
 * @access  Private (All Admin Roles)
 */
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  adminClientProfileController.getClientProfileById
);

/**
 * @route   PATCH /api/v1/admin/client-profiles/:id
 * @desc    Update client profile and/or linked user account details
 * @access  Private (All Admin Roles)
 */
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateClientProfileSchema, 'body'),
  adminClientProfileController.updateClientProfile
);

/**
 * @route   DELETE /api/v1/admin/client-profiles/:id
 * @desc    Soft-delete client profile and deactivate linked user account
 * @access  Private (Super Admin, Admin)
 */
router.delete(
  '/:id',
  hasPermission(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  adminClientProfileController.deleteClientProfile
);

module.exports = router;
