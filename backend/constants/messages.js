module.exports = {
  AUTH: {
    LOGIN_SUCCESS: 'Logged in successfully',
    REGISTER_SUCCESS: 'Account created successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_IN_USE: 'Email already in use',
    UNAUTHORIZED: 'Not authorized, token failed',
    NO_TOKEN: 'Not authorized, no token',
  },
  ORDER: {
    CREATED: 'Order placed successfully',
    UPDATED: 'Order status updated',
    NOT_FOUND: 'Order not found',
  },
  PRODUCT: {
    CREATED: 'Product added successfully',
    UPDATED: 'Product updated successfully',
    DELETED: 'Product removed successfully',
    NOT_FOUND: 'Product not found',
  },
  CATEGORY: {
    CREATED: 'Category created successfully',
    NOT_FOUND: 'Category not found',
  },
  GENERAL: {
    SERVER_ERROR: 'Internal Server Error',
    HEALTH_OK: 'Backend system is healthy',
  },
  PROFILE: {
    CREATED: 'Profile created successfully',
    UPDATED: 'Profile updated successfully',
    NOT_FOUND: 'Profile not found',
    PHOTO_UPLOADED: 'Photo uploaded successfully',
    PHOTO_REMOVED: 'Photo removed successfully',
    DOC_UPLOADED: 'Document uploaded successfully',
    DOC_REMOVED: 'Document removed successfully',
    GALLERY_FULL: 'Gallery is full (max 10 photos)',
    UNAUTHORIZED_FIELD: 'You are not authorized to update this field',
  },
};
