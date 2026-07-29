/**
 * Centralized User-Facing UI Messages, Labels, Prompts, and Toast Texts for Admin Application
 */
export const ADMIN_UI_MESSAGES = {
  // Portal Titles & Headers
  PORTAL_TITLE: 'SJC Matrimony Admin Portal',
  DASHBOARD_TITLE: 'Dashboard Overview',
  USER_MGMT_TITLE: 'Profile Management',
  CONTACT_REQ_TITLE: 'Contact Requests Queue',
  SUBSCRIPTIONS_TITLE: 'Subscription Management',
  MARRIAGE_REG_TITLE: 'Marriage Register Collection',
  CONFIG_MGMT_TITLE: 'System Configuration',

  // Buttons & Actions
  BUTTONS: {
    CREATE_PLAN: 'Create New Plan',
    ADD_RECORD: 'Add Marriage Record',
    SAVE: 'Save Changes',
    SAVE_CONFIG: 'Save Configuration',
    RESET_DEFAULTS: 'Reset to Defaults',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    EDIT: 'Edit',
    VIEW: 'View Details',
    APPROVE: 'Approve',
    REJECT: 'Reject',
    VERIFY: 'Verify Profile',
    FILTER: 'Filter',
    SEARCH: 'Search',
    TOGGLE_STATUS: 'Toggle Status',
  },

  // Toast Notifications
  TOAST: {
    FETCH_ERROR: 'Failed to fetch data from backend.',
    PLAN_CREATED: 'Subscription plan created successfully!',
    PLAN_UPDATED: 'Subscription plan updated successfully!',
    PLAN_DELETED: 'Subscription plan deleted successfully!',
    RECORD_CREATED: 'Marriage record saved successfully!',
    RECORD_UPDATED: 'Marriage record updated successfully!',
    RECORD_DELETED: 'Marriage record deleted successfully!',
    CONFIG_SAVED: 'Configuration saved successfully!',
    CONFIG_RESET: 'Configuration reset to default settings!',
    STATUS_UPDATED: 'Status updated successfully.',
    FILE_UPLOAD_SUCCESS: 'File uploaded successfully.',
    FILE_UPLOAD_ERROR: 'Failed to upload file.',
  },

  // Empty & Loading States
  STATES: {
    LOADING_DATA: 'Loading data...',
    NO_SUBSCRIPTIONS: 'No subscription plans found.',
    NO_MARRIAGE_RECORDS: 'No marriage register records found.',
    NO_PROFILES: 'No member profiles match filters.',
    NO_CONTACT_REQUESTS: 'No contact requests found in queue.',
  },

  // Confirmations
  CONFIRMATIONS: {
    DELETE_PLAN: 'Are you sure you want to delete this subscription plan?',
    DELETE_RECORD: 'Are you sure you want to delete this marriage record?',
    RESET_CONFIG: 'Are you sure you want to reset all portal settings back to factory defaults?',
  },
};

export default ADMIN_UI_MESSAGES;
