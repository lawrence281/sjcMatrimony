const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { JWT_CONFIG } = require('../constants/jwtConfig');

/**
 * Initializes Socket.io with the HTTP server.
 * Registers authentication middleware and event handlers.
 *
 * @param {http.Server} httpServer - The Node.js HTTP server instance
 * @returns {import('socket.io').Server} io instance
 */
const initializeSocket = (httpServer) => {
  const { Server } = require('socket.io');

  const io = new Server(httpServer, {
    cors: {
      origin: [process.env.CLIENT_ORIGIN, process.env.ADMIN_ORIGIN].filter(Boolean),
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ── JWT Authentication Middleware ──────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication required.'));
    }

    try {
      const decoded = jwt.verify(token, JWT_CONFIG.ACCESS_SECRET);
      socket.user = decoded;
      next();
    } catch {
      return next(new Error('Invalid or expired token.'));
    }
  });

  // ── Connection Handler ─────────────────────────────────
  io.on('connection', (socket) => {
    const userId = socket.user._id;
    logger.info(`Socket connected: ${socket.id} | User: ${userId}`);

    // Join personal room for targeted notifications
    socket.join(`user:${userId}`);

    // Register domain handlers
    const chatHandler = require('./handlers/chat.handler');
    const notificationHandler = require('./handlers/notification.handler');

    chatHandler(io, socket);
    notificationHandler(io, socket);

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} | User: ${userId} | Reason: ${reason}`);
    });

    socket.on('error', (error) => {
      logger.error(`Socket error [${socket.id}]: ${error.message}`);
    });
  });

  logger.info('Socket.io initialized.');
  return io;
};

module.exports = initializeSocket;
