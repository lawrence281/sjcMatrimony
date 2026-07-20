const ADMIN_MESSAGES = Object.freeze({
  ADMIN_CREATED: 'Admin user created successfully.',
  ADMIN_UPDATED: 'Admin user updated successfully.',
  ADMIN_DELETED: 'Admin user deleted successfully.',
  ADMIN_FETCHED: 'Admin details fetched successfully.',
  ADMINS_FETCHED: 'Admin list fetched successfully.',
  ADMIN_NOT_FOUND: 'Admin user not found.',
  SETTINGS_UPDATED: 'Platform settings updated successfully.',
  SETTINGS_FETCHED: 'Platform settings fetched successfully.',
  DASHBOARD_DATA_FETCHED: 'Dashboard data fetched successfully.',
  AUDIT_LOGS_FETCHED: 'Audit logs fetched successfully.',
  ACTIVITY_LOGS_FETCHED: 'Activity logs fetched successfully.',
  REPORTS_FETCHED: 'Reports fetched successfully.',
  REPORT_RESOLVED: 'Report resolved successfully.',

  // Profile moderation
  PROFILE_APPROVED: 'Profile approved successfully.',
  PROFILE_REJECTED: 'Profile rejected successfully.',
  PROFILE_SUSPENDED: 'Profile suspended successfully.',

  // Admin-created client profiles
  CLIENT_PROFILE_CREATED: 'Client profile created successfully.',
  CLIENT_PROFILE_UPDATED: 'Client profile updated successfully.',
  CLIENT_PROFILE_DELETED: 'Client profile deleted successfully.',
  CLIENT_PROFILE_FETCHED: 'Client profile fetched successfully.',
  CLIENT_PROFILES_FETCHED: 'Client profiles fetched successfully.',
  CLIENT_PROFILE_NOT_FOUND: 'Client profile not found.',

  // WhatsApp notification outcomes (for response metadata)
  WHATSAPP_SENT: 'WhatsApp onboarding message sent.',
  WHATSAPP_FAILED: 'WhatsApp message could not be delivered (profile created).',
});

module.exports = { ADMIN_MESSAGES };
