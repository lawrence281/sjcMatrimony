const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/admin/adminUser.controller');
const { hasPermission } = require('../../middlewares/auth/hasPermission');
const { ROLES } = require('../../constants/roles');
const {
  validate,
  idParamSchema,
  listAdminUsersSchema,
  createAdminUserSchema,
  updateAdminUserSchema,
} = require('../../validators/admin.validator');

// Restrict all administrative user management endpoints to Super Admin and Admin roles only
router.use(hasPermission(ROLES.SUPER_ADMIN, ROLES.ADMIN));

/**
 * @route   GET /api/v1/admin/users
 * @desc    List administrative users (staff/employees)
 * @access  Private (Super Admin / Admin)
 */
router.get(
  '/',
  validate(listAdminUsersSchema, 'query'),
  adminUserController.listAdminUsers
);

/**
 * @route   POST /api/v1/admin/users
 * @desc    Create new administrative user account
 * @access  Private (Super Admin / Admin)
 */
router.post(
  '/',
  validate(createAdminUserSchema, 'body'),
  adminUserController.createAdminUser
);

/**
 * @route   GET /api/v1/admin/users/:id
 * @desc    Get administrative user details by ID
 * @access  Private (Super Admin / Admin)
 */
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  adminUserController.getAdminUserById
);

/**
 * @route   PATCH /api/v1/admin/users/:id
 * @desc    Update administrative user details
 * @access  Private (Super Admin / Admin)
 */
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateAdminUserSchema, 'body'),
  adminUserController.updateAdminUser
);

/**
 * @route   PATCH /api/v1/admin/users/:id/toggle-status
 * @desc    Toggle administrative user account active status
 * @access  Private (Super Admin / Admin)
 */
router.patch(
  '/:id/toggle-status',
  validate(idParamSchema, 'params'),
  adminUserController.toggleUserStatus
);

/**
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Delete administrative user account
 * @access  Private (Super Admin / Admin)
 */
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  adminUserController.deleteAdminUser
);

module.exports = router;

