/**
 * CORS configuration.
 * Allows requests from both the Admin and Client portal origins.
 * Credentials must be allowed to support httpOnly cookie refresh tokens.
 */
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_ORIGIN,
      process.env.ADMIN_ORIGIN,
    ].filter(Boolean);

    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy: Origin ${origin} is not allowed.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
