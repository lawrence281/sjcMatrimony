export const ROLES = Object.freeze({
  SUPER_ADMIN:          'super_admin',
  ADMIN:                'admin',
  EMPLOYEE:             'employee',
  RELATIONSHIP_MANAGER: 'relationship_manager',
  FRANCHISE:            'franchise',
  VENDOR:               'vendor',
  SUPPORT:              'support',
  CLIENT:               'client',
});

export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.EMPLOYEE,
  ROLES.RELATIONSHIP_MANAGER,
  ROLES.FRANCHISE,
  ROLES.VENDOR,
  ROLES.SUPPORT,
];

export const CLIENT_ROLES = [ROLES.CLIENT];
