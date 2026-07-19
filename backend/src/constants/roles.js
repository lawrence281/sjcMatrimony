/**
 * Application-wide role constants.
 * Add new roles here as the platform scales.
 * These values are stored in the User model.
 */
const ROLES = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  RELATIONSHIP_MANAGER: 'relationship_manager',
  FRANCHISE: 'franchise',
  VENDOR: 'vendor',
  SUPPORT: 'support',
  CLIENT: 'client',
});

/** Roles that have access to the Admin Portal */
const ADMIN_ROLES = Object.freeze([
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.EMPLOYEE,
  ROLES.RELATIONSHIP_MANAGER,
  ROLES.FRANCHISE,
  ROLES.VENDOR,
  ROLES.SUPPORT,
]);

/** Roles that have access to the Client Portal */
const CLIENT_ROLES = Object.freeze([ROLES.CLIENT]);

module.exports = { ROLES, ADMIN_ROLES, CLIENT_ROLES };
