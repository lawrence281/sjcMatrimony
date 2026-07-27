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
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
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

// Compound index to allow quick queries for requestedBy & requestedProfile
contactRequestSchema.index({ requestedBy: 1, requestedProfile: 1 });

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
