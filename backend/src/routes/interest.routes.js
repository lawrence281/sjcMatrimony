const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interest/interest.controller');
const verifyToken = require('../middlewares/auth/verifyToken');
const {
  validate,
  idParamSchema,
  sendInterestSchema,
  respondInterestSchema,
  listInterestsSchema,
} = require('../validators/interest.validator');

// Protect all connection interest endpoints
router.use(verifyToken);

/**
 * @route   POST /api/v1/interests
 * @desc    Send a connection interest invitation to another user
 * @access  Private (Authenticated)
 */
router.post(
  '/',
  validate(sendInterestSchema, 'body'),
  interestController.sendInterest
);

/**
 * @route   PATCH /api/v1/interests/:id/respond
 * @desc    Accept or reject a received interest
 * @access  Private (Authenticated)
 */
router.patch(
  '/:id/respond',
  validate(idParamSchema, 'params'),
  validate(respondInterestSchema, 'body'),
  interestController.respondInterest
);

/**
 * @route   PATCH /api/v1/interests/:id/accept
 * @desc    Accept a received interest
 * @access  Private (Authenticated)
 */
router.patch(
  '/:id/accept',
  validate(idParamSchema, 'params'),
  interestController.acceptInterest
);

/**
 * @route   PATCH /api/v1/interests/:id/reject
 * @desc    Reject a received interest
 * @access  Private (Authenticated)
 */
router.patch(
  '/:id/reject',
  validate(idParamSchema, 'params'),
  interestController.rejectInterest
);

/**
 * @route   PATCH /api/v1/interests/:id/cancel
 * @desc    Cancel/retract a sent pending interest
 * @access  Private (Authenticated)
 */
router.patch(
  '/:id/cancel',
  validate(idParamSchema, 'params'),
  interestController.cancelInterest
);

/**
 * @route   DELETE /api/v1/interests/:id
 * @desc    Cancel/retract a sent pending interest (Frontend compatibility)
 * @access  Private (Authenticated)
 */
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  interestController.cancelInterest
);

/**
 * @route   GET /api/v1/interests/sent
 * @desc    List interests sent by the user
 * @access  Private (Authenticated)
 */
router.get(
  '/sent',
  validate(listInterestsSchema, 'query'),
  interestController.getSentInterests
);

/**
 * @route   GET /api/v1/interests/received
 * @desc    List interests received by the user
 * @access  Private (Authenticated)
 */
router.get(
  '/received',
  validate(listInterestsSchema, 'query'),
  interestController.getReceivedInterests
);

module.exports = router;

