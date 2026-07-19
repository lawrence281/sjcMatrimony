const AuditLog = require('../../models/AuditLog.model');
const logger = require('../../utils/logger');

/**
 * Audit logging middleware factory.
 * Records admin actions with full request context for compliance and debugging.
 *
 * @param {string} action - Human-readable action name (e.g., 'APPROVE_PROFILE')
 * @param {string} resource - Resource being acted upon (e.g., 'Profile')
 *
 * @example
 * router.patch('/:id/approve', verifyToken, isAdminRole,
 *   auditLog('APPROVE_PROFILE', 'Profile'), controller.approveProfile)
 */
const auditLog = (action, resource) => {
  return async (req, res, next) => {
    // Store original json method to intercept response
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      // Only log on success responses
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        try {
          await AuditLog.create({
            performedBy: req.user._id,
            role: req.user.role,
            action,
            resource,
            resourceId: req.params.id || null,
            ipAddress: req.ip || req.headers['x-forwarded-for'],
            userAgent: req.headers['user-agent'],
            requestBody: req.method !== 'GET' ? req.body : undefined,
            statusCode: res.statusCode,
          });
        } catch (error) {
          // Never let audit log failure break the main flow
          logger.warn(`Audit log failed for action ${action}: ${error.message}`);
        }
      }
      return originalJson(body);
    };

    next();
  };
};

module.exports = auditLog;
