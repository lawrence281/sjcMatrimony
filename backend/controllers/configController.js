const Config = require('../models/Config');
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('../constants/statusCodes');

const DEFAULT_CONFIG_DATA = {
  appName: 'SJC Matrimony',
  appLogo: '',
  appFavicon: '',
  contactEmail: 'admin@sjcmatrimony.org',
  contactNumber: '+91 9876543210',
  address: 'St. Joseph Church Complex, Main Road',
  enableNewRegistration: true,
  enableContactRequests: true,
  enableProfileVerification: true,
  defaultMembershipType: 'free',
  defaultProfileVisibility: 'registered',
  profileApprovalRequired: false,
  maxGalleryImages: 6,
  allowedDocumentTypes: ['pdf', 'jpg', 'png', 'webp'],
  defaultSubscriptionPlan: 'free',
  subscriptionRenewalReminderDays: 7,
  trialPeriodDays: 14,
  enableTrial: false,
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  enableWhatsappNotifications: true,
  adminAlertEmail: 'alerts@sjcmatrimony.org',
  maxImageSizeMB: 5,
  maxDocumentSizeMB: 10,
  allowedImageFormats: ['jpeg', 'jpg', 'png', 'webp'],
  allowedDocumentFormats: ['pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx'],
  passwordMinLength: 8,
  requirePasswordSpecialChar: true,
  sessionTimeoutMinutes: 120,
  loginAttemptLimit: 5,
  accountLockDurationMinutes: 30,
};

/**
 * @desc Get application-wide configuration settings
 * @route GET /api/config
 * @access Admin / Public (limited fields)
 */
const getConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config(DEFAULT_CONFIG_DATA);
      await config.save();
    }
    return res.status(OK).json({
      success: true,
      config,
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch configuration settings',
      error: error.message,
    });
  }
};

/**
 * @desc Update application-wide configuration settings
 * @route PUT /api/config
 * @access Admin
 */
const updateConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config(DEFAULT_CONFIG_DATA);
    }

    const allowedFields = Object.keys(DEFAULT_CONFIG_DATA);
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        config[field] = req.body[field];
      }
    });

    await config.save();

    return res.status(OK).json({
      success: true,
      message: 'Configuration updated successfully',
      config,
    });
  } catch (error) {
    console.error('Error updating config:', error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update configuration settings',
      error: error.message,
    });
  }
};

/**
 * @desc Reset configuration settings to default values
 * @route POST /api/config/reset
 * @access Admin
 */
const resetConfigToDefault = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (config) {
      Object.assign(config, DEFAULT_CONFIG_DATA);
    } else {
      config = new Config(DEFAULT_CONFIG_DATA);
    }
    await config.save();

    return res.status(OK).json({
      success: true,
      message: 'Configuration reset to default values successfully',
      config,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to reset configuration settings',
      error: error.message,
    });
  }
};

/**
 * @desc Upload config logo or favicon
 * @route POST /api/config/upload
 * @access Admin
 */
const uploadConfigMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'No image file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(OK).json({
      success: true,
      message: 'Config asset uploaded successfully',
      fileUrl,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Config upload failed',
      error: error.message,
    });
  }
};

module.exports = {
  getConfig,
  updateConfig,
  resetConfigToDefault,
  uploadConfigMedia,
};
