const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/user.controller');
const blockedUserController = require('../controllers/blockedUser/blockedUser.controller');
const verifyToken = require('../middlewares/auth/verifyToken');
const { isAdminRole } = require('../middlewares/auth/hasPermission');
const {
  validate,
  idParamSchema,
  listUsersSchema,
  updateUserSchema,
} = require('../validators/user.validator');
const { blockUserSchema } = require('../validators/blockedUser.validator');

// Mount verifyToken middleware to protect all user management endpoints
router.use(verifyToken);

/**
 * @route   GET /api/v1/users/block
 * @desc    Get logged-in user blocked list
 * @access  Private (Authenticated)
 */
router.get('/block', blockedUserController.getBlockList);

/**
 * @route   POST /api/v1/users/block
 * @desc    Block a user
 * @access  Private (Authenticated)
 */
router.post('/block', validate(blockUserSchema, 'body'), blockedUserController.blockUser);

/**
 * @route   DELETE /api/v1/users/block/:id
 * @desc    Unblock a user
 * @access  Private (Authenticated)
 */
router.delete('/block/:id', validate(idParamSchema, 'params'), blockedUserController.unblockUser);

/**
 * @route   GET /api/v1/users
 * @desc    Get paginated users (Admin only)
 * @access  Private (Admin)
 */
router.get(
  '/',
  isAdminRole,
  validate(listUsersSchema, 'query'),
  userController.listUsers
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user details by ID (Self or Admin)
 * @access  Private (Self/Admin)
 */
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  userController.getUserById
);

/**
 * @route   PATCH /api/v1/users/:id
 * @desc    Update user details (Self or Admin)
 * @access  Private (Self/Admin)
 */
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateUserSchema, 'body'),
  userController.updateUser
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user account by ID (Admin only)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  isAdminRole,
  validate(idParamSchema, 'params'),
  userController.deleteUser
);

module.exports = router;
