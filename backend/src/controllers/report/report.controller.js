const reportService = require('../../services/report/report.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { COMMON_MESSAGES } = require('../../messages/commonMessages');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Report Controller
 * Manages client-submitted reports.
 */
const reportController = {
  /**
   * POST /reports
   * Submits a report about another client user.
   */
  createReport: catchAsync(async (req, res) => {
    const report = await reportService.createReport(req.user._id, req.body);
    sendSuccess(res, SUCCESS.CREATED, COMMON_MESSAGES.REPORT_SUBMITTED, { report });
  }),
};

module.exports = reportController;
