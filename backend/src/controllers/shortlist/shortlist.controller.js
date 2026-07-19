const shortlistService = require('../../services/shortlist/shortlist.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { COMMON_MESSAGES } = require('../../messages/commonMessages');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Shortlist Controller
 * Maps request inputs to ShortlistService.
 */
const shortlistController = {
  /**
   * POST /shortlist
   * Adds profile user to bookmarks.
   */
  addToShortlist: catchAsync(async (req, res) => {
    const { shortlistedUserId } = req.body;
    const entry = await shortlistService.addToShortlist(req.user._id, shortlistedUserId);
    sendSuccess(res, SUCCESS.CREATED, COMMON_MESSAGES.PROFILE_SHORTLISTED, { entry });
  }),

  /**
   * DELETE /shortlist/:id
   * Removes profile user from bookmarks.
   */
  removeFromShortlist: catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await shortlistService.removeFromShortlist(req.user._id, id);
    sendSuccess(res, SUCCESS.OK, result.message);
  }),

  /**
   * GET /shortlist
   * Retrieves shortlisted profiles.
   */
  getShortlist: catchAsync(async (req, res) => {
    const entries = await shortlistService.getShortlist(req.user._id);
    sendSuccess(res, SUCCESS.OK, COMMON_MESSAGES.SHORTLIST_FETCHED, entries);
  }),
};

module.exports = shortlistController;
