require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const corsOptions = require('./src/config/cors');
const { apiLimiter } = require('./src/config/rateLimiter');
const { configureCloudinary } = require('./src/config/cloudinary');
const swaggerSpec = require('./src/config/swagger');
const sanitizeRequest = require('./src/middlewares/sanitize/sanitize.middleware');
const errorHandler = require('./src/middlewares/errorHandler');
const routes = require('./src/routes/index');
const logger = require('./src/utils/logger');
const ApiError = require('./src/utils/ApiError');
const { STATUS } = require('./src/statusCodes/error');
const { COMMON_MESSAGES } = require('./src/messages/commonMessages');

// Register event listeners
const registerNotificationListeners = require('./src/events/listeners/notification.listener');

// ── Configure External Services ────────────────────────────
configureCloudinary();
registerNotificationListeners();

const app = express();

// ── Security Middlewares ───────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));

// ── Request Parsing ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Sanitization ───────────────────────────────────────────
app.use(sanitizeRequest);

// ── Logging ────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Use stream to pipe morgan output to winston in production
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.http(message.trim()) },
      skip: (req) => req.url === '/api/v1/health',
    })
  );
}

// ── Rate Limiting ──────────────────────────────────────────
app.use('/api/', apiLimiter);

// ── API Documentation ──────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Matrimony API Docs',
  }));
  logger.info('Swagger UI available at /api-docs');
}

// ── API Routes ─────────────────────────────────────────────
app.use(`/api/${process.env.API_VERSION || 'v1'}`, routes);

// ── Root Route ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Matrimony Platform API',
    version: process.env.API_VERSION || 'v1',
    docs: '/api-docs',
  });
});

// ── 404 Handler ────────────────────────────────────────────
app.use((req, res, next) => {
  next(new ApiError(STATUS.NOT_FOUND, `${COMMON_MESSAGES.ROUTE_NOT_FOUND}: ${req.originalUrl}`));
});

// ── Global Error Handler (must be last) ───────────────────
app.use(errorHandler);

module.exports = app;
