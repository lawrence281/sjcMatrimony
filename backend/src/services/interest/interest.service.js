const interestRepository = require('../../repositories/interest.repository');
const userRepository = require('../../repositories/user.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { INTEREST_STATUS } = require('../../constants/interestStatus');
const { COMMON_MESSAGES } = require('../../messages/commonMessages');

/**
 * Interest Service
 * Manages relationships matching connections (interests).
 */
const interestService = {
  /**
   * Sends a connection invitation interest to another user.
   *
   * @param {string} senderId - Invitation sender ID
   * @param {string} receiverId - Invitation recipient ID
   * @param {string} [message] - Invitation note
   * @returns {Promise<Object>} Created interest object
   */
  async sendInterest(senderId, receiverId, message = null) {
    if (senderId.toString() === receiverId.toString()) {
      throw new ApiError(STATUS.BAD_REQUEST, COMMON_MESSAGES.CANNOT_SEND_TO_SELF);
    }

    // Verify receiver exists
    const receiverExists = await userRepository.findById(receiverId);
    if (!receiverExists) {
      throw new ApiError(STATUS.NOT_FOUND, 'Target user not found.');
    }

    // Check if interest is already active/exists between the two users
    const existing = await interestRepository.findInterestBetweenUsers(senderId, receiverId);
    if (existing) {
      throw new ApiError(STATUS.CONFLICT, COMMON_MESSAGES.INTEREST_ALREADY_SENT);
    }

    return interestRepository.create({
      senderId,
      receiverId,
      message,
      status: INTEREST_STATUS.PENDING,
    });
  },

  /**
   * Action to accept/reject received interest.
   *
   * @param {string} receiverId - Receiver ID matching logged-in user
   * @param {string} interestId - Target Interest ID
   * @param {string} status - accepted | rejected
   * @param {string} [rejectionReason]
   * @returns {Promise<Object>} Updated interest object
   */
  async respondInterest(receiverId, interestId, status, rejectionReason = null) {
    const interest = await interestRepository.findById(interestId);
    if (!interest) {
      throw new ApiError(STATUS.NOT_FOUND, 'Interest record not found.');
    }

    // Ensure authorized
    if (interest.receiverId.toString() !== receiverId.toString()) {
      throw new ApiError(STATUS.FORBIDDEN, COMMON_MESSAGES.FORBIDDEN);
    }

    // Must be pending to respond
    if (interest.status !== INTEREST_STATUS.PENDING) {
      throw new ApiError(STATUS.BAD_REQUEST, 'This interest has already been processed.');
    }

    const updateFields = {
      status,
      rejectionReason: status === INTEREST_STATUS.REJECTED ? rejectionReason : null,
      respondedAt: new Date(),
    };

    return interestRepository.updateById(interestId, updateFields);
  },

  /**
   * Cancels/retracts a sent interest.
   *
   * @param {string} senderId - Sender ID matching logged-in user
   * @param {string} interestId - Target Interest ID
   * @returns {Promise<Object>} Cancelled interest object
   */
  async cancelInterest(senderId, interestId) {
    const interest = await interestRepository.findById(interestId);
    if (!interest) {
      throw new ApiError(STATUS.NOT_FOUND, 'Interest record not found.');
    }

    if (interest.senderId.toString() !== senderId.toString()) {
      throw new ApiError(STATUS.FORBIDDEN, COMMON_MESSAGES.FORBIDDEN);
    }

    if (interest.status !== INTEREST_STATUS.PENDING) {
      throw new ApiError(STATUS.BAD_REQUEST, 'Only pending interests can be cancelled.');
    }

    return interestRepository.updateById(interestId, { status: INTEREST_STATUS.CANCELLED });
  },

  /**
   * Lists interests sent by the user.
   *
   * @param {string} senderId
   * @param {string} [status]
   * @returns {Promise<Array>}
   */
  async getSentInterests(senderId, status) {
    return interestRepository.findSentInterests(senderId, status);
  },

  /**
   * Lists interests received by the user.
   *
   * @param {string} receiverId
   * @param {string} [status]
   * @returns {Promise<Array>}
   */
  async getReceivedInterests(receiverId, status) {
    return interestRepository.findReceivedInterests(receiverId, status);
  },
};

module.exports = interestService;
