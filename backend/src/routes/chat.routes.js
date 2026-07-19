const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat/chat.controller');
const verifyToken = require('../middlewares/auth/verifyToken');
const {
  validate,
  idParamSchema,
  createChatSchema,
  listMessagesSchema,
  sendMessageSchema,
} = require('../validators/chat.validator');

// Protect all direct messaging endpoints
router.use(verifyToken);

/**
 * @route   GET /api/v1/chats
 * @desc    List conversation channels for the logged-in user
 * @access  Private (Authenticated)
 */
router.get('/', chatController.listChats);

/**
 * @route   POST /api/v1/chats
 * @desc    Open or retrieve a chat room with another user
 * @access  Private (Authenticated)
 */
router.post('/', validate(createChatSchema, 'body'), chatController.createChat);

/**
 * @route   GET /api/v1/chats/:id/messages
 * @desc    List paginated conversation messages
 * @access  Private (Authenticated)
 */
router.get(
  '/:id/messages',
  validate(idParamSchema, 'params'),
  validate(listMessagesSchema, 'query'),
  chatController.listMessages
);

/**
 * @route   POST /api/v1/chats/:id/messages
 * @desc    Send a message via REST endpoint
 * @access  Private (Authenticated)
 */
router.post(
  '/:id/messages',
  validate(idParamSchema, 'params'),
  validate(sendMessageSchema, 'body'),
  chatController.sendMessage
);

/**
 * @route   PATCH /api/v1/chats/:id/read
 * @desc    Mark conversation messages as read
 * @access  Private (Authenticated)
 */
router.patch(
  '/:id/read',
  validate(idParamSchema, 'params'),
  chatController.markAsRead
);

module.exports = router;

