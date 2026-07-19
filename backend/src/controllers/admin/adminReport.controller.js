const reportService = require('../../services/report/report.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { ADMIN_MESSAGES } = require('../../messages/adminMessages');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Admin Report Controller
 * Handles report moderation operations.
 */
const adminReportController = {
  /**
   * GET /admin/reports
   * Fetches paginated platform reports.
   */
  listReports: catchAsync(async (req, res) => {
    const result = await reportService.listReports(req.query);
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.REPORTS_FETCHED, result.reports, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  }),

  /**
   * PATCH /admin/reports/:id/resolve
   * Moderates and resolves a report.
   */
  resolveReport: catchAsync(async (req, res) => {
    const report = await reportService.resolveReport(req.params.id, req.body, req.user._id);
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.REPORT_RESOLVED, { report });
  }),
};

module.exports = adminReportController;
