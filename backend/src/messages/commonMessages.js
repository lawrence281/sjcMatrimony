const COMMON_MESSAGES = Object.freeze({
  // Generic
  SUCCESS: 'Operation completed successfully.',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_FAILED: 'Validation failed.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  UNAUTHORIZED: 'Please login to continue.',
  ROUTE_NOT_FOUND: 'The requested route does not exist.',
  INTERNAL_SERVER_ERROR: 'Internal server error.',

  // Pagination / List
  RECORDS_FETCHED: 'Records fetched successfully.',
  NO_RECORDS_FOUND: 'No records found.',

  // Interest
  INTEREST_SENT: 'Interest sent successfully.',
  INTEREST_ACCEPTED: 'Interest accepted successfully.',
  INTEREST_REJECTED: 'Interest rejected.',
  INTEREST_CANCELLED: 'Interest cancelled.',
  INTEREST_ALREADY_SENT: 'You have already sent an interest to this profile.',
  CANNOT_SEND_TO_SELF: 'You cannot send interest to yourself.',
  INTEREST_FETCHED: 'Interest details fetched.',
  INTERESTS_FETCHED: 'Interests fetched successfully.',

  // Shortlist
  PROFILE_SHORTLISTED: 'Profile added to shortlist.',
  PROFILE_UNSHORTLISTED: 'Profile removed from shortlist.',
  ALREADY_SHORTLISTED: 'Profile is already in your shortlist.',
  SHORTLIST_FETCHED: 'Shortlist fetched successfully.',
  SHORTLIST_LIMIT_EXCEEDED: 'You have reached your shortlist limit. Upgrade your plan.',

  // Block
  USER_BLOCKED: 'User blocked successfully.',
  USER_UNBLOCKED: 'User unblocked successfully.',
  USER_ALREADY_BLOCKED: 'This user is already blocked.',

  // Report
  REPORT_SUBMITTED: 'Report submitted successfully.',
  REPORT_ALREADY_SUBMITTED: 'You have already submitted a report for this user.',

  // Subscription
  SUBSCRIPTION_ACTIVATED: 'Subscription activated successfully.',
  SUBSCRIPTION_EXPIRED: 'Your subscription has expired. Please renew.',
  SUBSCRIPTION_FETCHED: 'Subscription details fetched.',
  PLANS_FETCHED: 'Plans fetched successfully.',

  // Notifications
  NOTIFICATION_FETCHED: 'Notifications fetched successfully.',
  NOTIFICATIONS_MARKED_READ: 'Notifications marked as read.',
  NOTIFICATION_DELETED: 'Notification deleted.',

  // Upload
  FILE_UPLOADED: 'File uploaded successfully.',
  FILE_UPLOAD_FAILED: 'File upload failed.',
  INVALID_FILE_TYPE: 'Invalid file type. Allowed types: JPEG, PNG, PDF.',
  FILE_SIZE_EXCEEDED: 'File size exceeds the maximum limit.',
});

module.exports = { COMMON_MESSAGES };
