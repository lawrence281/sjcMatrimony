const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestedProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: true,
    },
    receiverUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Approved',
        'Rejected',
        'Pending Member Review',
        'Pending Admin Verification',
        'Rejected by Member',
        'Rejected by Admin',
      ],
      default: 'Pending',
    },
    memberActionDate: {
      type: Date,
      default: null,
    },
    adminRemarks: {
      type: String,
      trim: true,
      default: '',
    },
    approvalDate: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast queries
contactRequestSchema.index({ requestedBy: 1, requestedProfile: 1 });
contactRequestSchema.index({ receiverUser: 1, status: 1 });
contactRequestSchema.index({ status: 1 });

module.exports = mongoose.model('ContactRequest', contactRequestSchema);

