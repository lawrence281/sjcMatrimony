const mongoose = require('mongoose');

const configSchema = new mongoose.Schema(
  {
    // General Settings
    appName: { type: String, default: 'SJC Matrimony' },
    appLogo: { type: String, default: '' },
    appFavicon: { type: String, default: '' },
    contactEmail: { type: String, default: 'admin@sjcmatrimony.org' },
    contactNumber: { type: String, default: '+91 9876543210' },
    address: { type: String, default: 'St. Joseph Church Complex, Main Road' },

    // Matrimony Settings
    enableNewRegistration: { type: Boolean, default: true },
    enableContactRequests: { type: Boolean, default: true },
    enableProfileVerification: { type: Boolean, default: true },
    defaultMembershipType: { type: String, default: 'free' },
    defaultProfileVisibility: { type: String, default: 'registered' }, // 'all', 'registered', 'verified'
    profileApprovalRequired: { type: Boolean, default: false },
    maxGalleryImages: { type: Number, default: 6 },
    allowedDocumentTypes: { type: [String], default: ['pdf', 'jpg', 'png', 'webp'] },

    // Subscription Settings
    defaultSubscriptionPlan: { type: String, default: 'free' },
    subscriptionRenewalReminderDays: { type: Number, default: 7 },
    trialPeriodDays: { type: Number, default: 14 },
    enableTrial: { type: Boolean, default: false },

    // Notification Settings
    enableEmailNotifications: { type: Boolean, default: true },
    enableSmsNotifications: { type: Boolean, default: false },
    enableWhatsappNotifications: { type: Boolean, default: true },
    adminAlertEmail: { type: String, default: 'alerts@sjcmatrimony.org' },

    // Media Settings
    maxImageSizeMB: { type: Number, default: 5 },
    maxDocumentSizeMB: { type: Number, default: 10 },
    allowedImageFormats: { type: [String], default: ['jpeg', 'jpg', 'png', 'webp'] },
    allowedDocumentFormats: { type: [String], default: ['pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx'] },

    // Security Settings
    passwordMinLength: { type: Number, default: 8 },
    requirePasswordSpecialChar: { type: Boolean, default: true },
    sessionTimeoutMinutes: { type: Number, default: 120 },
    loginAttemptLimit: { type: Number, default: 5 },
    accountLockDurationMinutes: { type: Number, default: 30 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Config', configSchema);
