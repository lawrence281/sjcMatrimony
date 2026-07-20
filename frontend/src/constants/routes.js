// Route path constants — prevents hardcoded strings in navigation
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  VERIFY_OTP: '/verify-otp',

  // Client Portal
  CLIENT: {
    DASHBOARD:    '/dashboard',
    MY_PROFILE:   '/profile/me',
    EDIT_PROFILE: '/profile/edit',
    VIEW_PROFILE: '/profile/:id',
    SEARCH:       '/search',
    INTERESTS:    '/interests',
    SHORTLIST:    '/shortlist',
    PLANS:        '/plans',
    CHAT:         '/chat',
    CHAT_ROOM:    '/chat/:chatId',
    SETTINGS:     '/settings',
    NOTIFICATIONS:'/notifications',
  },

  // Admin Portal
  ADMIN: {
    DASHBOARD:       '/admin/dashboard',
    USERS:           '/admin/users',
    USER_DETAIL:     '/admin/users/:id',
    PROFILES:        '/admin/profiles',
    PROFILE_DETAIL:  '/admin/profiles/:id',
    CLIENT_PROFILES: '/admin/client-profiles',
    SUBSCRIPTIONS:   '/admin/subscriptions',
    PAYMENTS:        '/admin/payments',
    REPORTS:         '/admin/reports',
    SETTINGS:        '/admin/settings',
    ADMINS:          '/admin/team',
  },

  // Errors
  NOT_FOUND:    '/404',
  UNAUTHORIZED: '/unauthorized',
};
