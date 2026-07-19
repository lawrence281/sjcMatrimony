const searchService = require('../../services/search/search.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Search Controller
 * Maps incoming search requests to SearchService.
 */
const searchController = {
  /**
   * GET /search
   * Returns a paginated list of matching profiles.
   */
  searchProfiles: catchAsync(async (req, res) => {
    const result = await searchService.searchProfiles(req.query, req.user);

    sendSuccess(
      res,
      SUCCESS.OK,
      'Profiles fetched successfully.',
      result.profiles,
      {
        total: result.total,
        page: result.page,
        limit: result.limit,
      }
    );
  }),
};

module.exports = searchController;
