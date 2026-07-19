const USER_MESSAGES = Object.freeze({
  USER_CREATED: 'User created successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',
  USER_FETCHED: 'User fetched successfully.',
  USERS_FETCHED: 'Users fetched successfully.',
  USER_NOT_FOUND: 'User not found.',
  USER_ALREADY_EXISTS: 'User already exists.',
  CANNOT_DELETE_SELF: 'You cannot delete your own account through this endpoint.',
  PASSWORD_UPDATED: 'Password updated successfully.',
  CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect.',
  ACCOUNT_DEACTIVATED: 'Account deactivated successfully.',
});

module.exports = { USER_MESSAGES };
