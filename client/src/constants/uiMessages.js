/**
 * Centralized User-Facing UI Messages, Labels, Prompts, and Toast Texts for Client Application
 */
export const UI_MESSAGES = {
  // Navigation & Branding
  BRAND_NAME: 'SJC Matrimony',
  SLOGAN: 'Christian Matrimony Portal',

  // Buttons & Actions
  BUTTONS: {
    SAVE: 'Save Changes',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    EDIT: 'Edit Profile',
    SUBMIT: 'Submit',
    SEARCH: 'Search Profiles',
    FILTER: 'Apply Filters',
    RESET: 'Reset Filters',
    REQUEST_CONTACT: 'Send Contact Request',
    VIEW_DETAILS: 'View Full Profile',
    LOGIN: 'Sign In',
    LOGOUT: 'Sign Out',
    REGISTER: 'Register Profile',
    UPLOAD_PHOTO: 'Upload Photo',
    UPLOAD_DOC: 'Upload Document',
  },

  // Form Field Labels & Placeholders
  FORMS: {
    SEARCH_PLACEHOLDER: 'Search by Name, City, Profession...',
    GENDER_LABEL: 'Gender',
    AGE_RANGE_LABEL: 'Age Range',
    RELIGION_LABEL: 'Religion & Parish',
    LOCATION_LABEL: 'Location',
    EDUCATION_LABEL: 'Education & Profession',
  },

  // Toast Notifications & Feedback
  TOAST: {
    FETCH_ERROR: 'Failed to load profile data. Please try again.',
    SAVE_SUCCESS: 'Profile updated successfully!',
    SAVE_ERROR: 'Failed to save changes.',
    CONTACT_REQ_SUCCESS: 'Contact request sent successfully!',
    CONTACT_REQ_EXISTS: 'You have already sent a contact request to this profile.',
    LOGIN_SUCCESS: 'Welcome back!',
    LOGIN_ERROR: 'Invalid email or password.',
    LOGOUT_SUCCESS: 'Successfully logged out.',
  },

  // Empty & Loading States
  STATES: {
    LOADING_PROFILES: 'Loading matrimony profiles...',
    NO_PROFILES: 'No profiles match your search criteria.',
    NO_CONTACT_REQUESTS: 'You have no contact requests yet.',
    NO_DOCUMENTS: 'No documents uploaded yet.',
  },

  // Confirmation Prompts
  CONFIRMATIONS: {
    DELETE_PHOTO: 'Are you sure you want to delete this photo?',
    CANCEL_REQUEST: 'Are you sure you want to cancel this request?',
  },
};

export default UI_MESSAGES;
