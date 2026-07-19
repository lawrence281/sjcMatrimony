const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: { type: String, required: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    ipAddress: { type: String },
    userAgent: { type: String },
    requestBody: { type: mongoose.Schema.Types.Mixed, select: false },
    statusCode: { type: Number },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

// Auto-expire audit logs after 1 year (365 days)
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
