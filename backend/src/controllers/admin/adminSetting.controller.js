const adminSettingService = require('../../services/admin/adminSetting.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { ADMIN_MESSAGES } = require('../../messages/adminMessages');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Admin Setting Controller
 * Exposes setting operations to view/edit configuration metrics.
 */
const adminSettingController = {
  /**
   * GET /admin/settings
   * Lists all platform settings.
   */
  getSettings: catchAsync(async (req, res) => {
    const settings = await adminSettingService.getSettings();
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.SETTINGS_FETCHED, settings);
  }),

  /**
   * PUT /admin/settings/:key
   * Updates platform configuration values.
   */
  updateSetting: catchAsync(async (req, res) => {
    const { value } = req.body;
    const { key } = req.params;
    const setting = await adminSettingService.updateSetting(key, value, req.user._id);
    sendSuccess(res, SUCCESS.OK, ADMIN_MESSAGES.SETTINGS_UPDATED, { setting });
  }),
};

module.exports = adminSettingController;
