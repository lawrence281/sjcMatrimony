const reportRepository = require('../../repositories/report.repository');
const userRepository = require('../../repositories/user.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { COMMON_MESSAGES } = require('../../messages/commonMessages');

/**
 * Report Service
 * Handles submitting user reports and administrative moderation workflow.
 */
const reportService = {
  /**
   * Submits a new user abuse report.
   *
   * @param {string} reporterId - User ID filing the report
   * @param {Object} reportData - Reported user details (reportedUser, reason, description)
   * @returns {Promise<Object>} Submitted report object
   */
  async createReport(reporterId, reportData) {
    const { reportedUser, reason, description } = reportData;

    // Prevent reporting oneself
    if (reporterId.toString() === reportedUser.toString()) {
      throw new ApiError(STATUS.BAD_REQUEST, 'You cannot report your own account.');
    }

    // Verify reported user exists
    const targetUser = await userRepository.findById(reportedUser);
    if (!targetUser) {
      throw new ApiError(STATUS.NOT_FOUND, 'Reported user not found.');
    }

    // Check if report already exists to prevent duplicate spamming
    const existingReport = await reportRepository.findUserReport(reporterId, reportedUser);
    if (existingReport) {
      throw new ApiError(STATUS.CONFLICT, COMMON_MESSAGES.REPORT_ALREADY_SUBMITTED);
    }

    const report = await reportRepository.create({
      reportedBy: reporterId,
      reportedUser,
      reason,
      description,
      status: 'pending',
    });

    return report;
  },

  /**
   * Retrieves a paginated list of reports for administrators.
   *
   * @param {Object} query - Query parameters (page, limit, status, reason)
   * @returns {Promise<{ reports: Array, total: number, page: number, limit: number }>}
   */
  async listReports(query) {
    const { page = 1, limit = 10, status, reason } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (reason) {
      filter.reason = reason;
    }

    const reports = await reportRepository.listReports(filter, {
      skip,
      limit,
    });

    const total = await reportRepository.count(filter);

    return {
      reports,
      total,
      page,
      limit,
    };
  },

  /**
   * Resolves or dismisses a submitted report.
   *
   * @param {string} reportId - Target Report ID
   * @param {Object} resolutionData - Payload containing status and adminNote
   * @param {string} adminId - Administrator user ID
   * @returns {Promise<Object>} Updated report object
   */
  async resolveReport(reportId, resolutionData, adminId) {
    const { status, adminNote } = resolutionData;

    const report = await reportRepository.findById(reportId);
    if (!report) {
      throw new ApiError(STATUS.NOT_FOUND, 'Report not found.');
    }

    const updateFields = {
      status,
      adminNote,
      resolvedBy: adminId,
      resolvedAt: new Date(),
    };

    return reportRepository.updateById(reportId, updateFields);
  },
};

module.exports = reportService;
