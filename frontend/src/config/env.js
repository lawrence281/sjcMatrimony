/**
 * Environment variable wrappers.
 * Import from here instead of using import.meta.env directly.
 * Provides a single place to add defaults and validation.
 */
const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  SOCKET_URL:   import.meta.env.VITE_SOCKET_URL   || 'http://localhost:5000',
  APP_NAME:     import.meta.env.VITE_APP_NAME      || 'Matrimony Platform',
  NODE_ENV:     import.meta.env.MODE               || 'development',
  IS_PROD:      import.meta.env.PROD               || false,
  IS_DEV:       import.meta.env.DEV                || true,
};

export default env;
