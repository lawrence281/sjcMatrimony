const adminDashboardService = require('../../services/admin/adminDashboard.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { ADMIN_MESSAGES } = require('../../messages/adminMessages');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Admin Dashboard Controller
 * Exposes analytical metrics endpoints for the administration board.
 */
const adminDashboardController = {
  /**
   * GET /admin/dashboard
   * Retrieves administrative KPI counts.
   */
  getDashboardStats: catchAsync(async (req, res) => {
    const stats = await adminDashboardService.getDashboardStats();
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.DASHBOARD_DATA_FETCHED, stats);
  }),
};

module.exports = adminDashboardController;
