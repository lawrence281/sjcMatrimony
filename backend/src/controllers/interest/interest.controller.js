const interestService = require('../../services/interest/interest.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { COMMON_MESSAGES } = require('../../messages/commonMessages');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Interest Controller
 * Manages connection invitations and invitations answers.
 */
const interestController = {
  /**
   * POST /interests
   * Sends connection invitation.
   */
  sendInterest: catchAsync(async (req, res) => {
    const { receiverId, message } = req.body;
    const interest = await interestService.sendInterest(req.user._id, receiverId, message);
    sendSuccess(res, SUCCESS.CREATED, COMMON_MESSAGES.INTEREST_SENT, { interest });
  }),

  /**
   * PATCH /interests/:id/respond
   * Accepts or rejects connection invitation.
   */
  respondInterest: catchAsync(async (req, res) => {
    const { status, rejectionReason } = req.body;
    const interest = await interestService.respondInterest(
      req.user._id,
      req.params.id,
      status,
      rejectionReason
    );
    const msg =
      status === 'accepted'
        ? COMMON_MESSAGES.INTEREST_ACCEPTED
        : COMMON_MESSAGES.INTEREST_REJECTED;

    sendSuccess(res, SUCCESS.OK, msg, { interest });
  }),

  /**
   * PATCH /interests/:id/accept
   * Accepts a connection invitation.
   */
  acceptInterest: catchAsync(async (req, res) => {
    const interest = await interestService.respondInterest(
      req.user._id,
      req.params.id,
      'accepted'
    );
    sendSuccess(res, SUCCESS.OK, COMMON_MESSAGES.INTEREST_ACCEPTED, { interest });
  }),

  /**
   * PATCH /interests/:id/reject
   * Rejects a connection invitation.
   */
  rejectInterest: catchAsync(async (req, res) => {
    const { rejectionReason } = req.body;
    const interest = await interestService.respondInterest(
      req.user._id,
      req.params.id,
      'rejected',
      rejectionReason
    );
    sendSuccess(res, SUCCESS.OK, COMMON_MESSAGES.INTEREST_REJECTED, { interest });
  }),

  /**
   * PATCH /interests/:id/cancel or DELETE /interests/:id
   * Cancels a pending sent connection interest.
   */
  cancelInterest: catchAsync(async (req, res) => {
    const interest = await interestService.cancelInterest(req.user._id, req.params.id);
    sendSuccess(res, SUCCESS.OK, COMMON_MESSAGES.INTEREST_CANCELLED, { interest });
  }),

  /**
   * GET /interests/sent
   * Lists interests sent by the user.
   */
  getSentInterests: catchAsync(async (req, res) => {
    const interests = await interestService.getSentInterests(req.user._id, req.query.status);
    sendSuccess(res, SUCCESS.OK, COMMON_MESSAGES.INTERESTS_FETCHED, interests);
  }),

  /**
   * GET /interests/received
   * Lists interests received by the user.
   */
  getReceivedInterests: catchAsync(async (req, res) => {
    const interests = await interestService.getReceivedInterests(req.user._id, req.query.status);
    sendSuccess(res, SUCCESS.OK, COMMON_MESSAGES.INTERESTS_FETCHED, interests);
  }),
};

module.exports = interestController;
