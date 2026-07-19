const BaseRepository = require('./base.repository');
const Report = require('../models/Report.model');

class ReportRepository extends BaseRepository {
  constructor() {
    super(Report);
  }

  /**
   * Checks if a report already exists from a specific user against another.
   *
   * @param {string} reportedById
   * @param {string} reportedUserId
   * @returns {Promise<Object|null>} Report object if found
   */
  async findUserReport(reportedById, reportedUserId) {
    return this.model
      .findOne({ reportedBy: reportedById, reportedUser: reportedUserId })
      .lean();
  }

  /**
   * Fetches paginated reports with populated fields for admin portal.
   *
   * @param {Object} filter - Query filters
   * @param {Object} options - Pagination/sort configurations
   * @returns {Promise<Array>} List of reports
   */
  async listReports(filter = {}, options = {}) {
    const { sort = { createdAt: -1 }, skip = 0, limit = 10 } = options;

    return this.model
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('reportedBy', 'email phone role')
      .populate('reportedUser', 'email phone role')
      .populate('resolvedBy', 'email role')
      .lean();
  }
}

module.exports = new ReportRepository();
