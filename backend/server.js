require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDB = require('./src/config/database');
const initializeSocket = require('./src/socket/socket.init');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ── Create HTTP Server ─────────────────────────────────────
const httpServer = http.createServer(app);

// ── Initialize Socket.io ───────────────────────────────────
const io = initializeSocket(httpServer);

// Attach io to app for use in controllers if needed
app.set('io', io);

// ── Start Server ───────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    httpServer.listen(PORT, () => {
      logger.info('─────────────────────────────────────────────');
      logger.info(`  🚀 Server running in ${NODE_ENV.toUpperCase()} mode`);
      logger.info(`  📡 Port: ${PORT}`);
      logger.info(`  🔗 API: http://localhost:${PORT}/api/v1`);
      logger.info(`  📚 Docs: http://localhost:${PORT}/api-docs`);
      logger.info('─────────────────────────────────────────────');
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// ── Graceful Shutdown ──────────────────────────────────────
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  httpServer.close(() => {
    logger.info('HTTP server closed.');
    const mongoose = require('mongoose');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ── Unhandled Rejections & Exceptions ─────────────────────
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason: reason?.message || reason, promise });
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { message: error.message, stack: error.stack });
  gracefulShutdown('uncaughtException');
});

startServer();
