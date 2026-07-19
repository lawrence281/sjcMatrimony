const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: ['fake_profile', 'inappropriate_content', 'harassment', 'spam', 'scam', 'other'],
      required: true,
    },
    description: { type: String, maxlength: 1000 },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'resolved', 'dismissed'],
      default: 'pending',
      index: true,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: { type: Date, default: null },
    adminNote: { type: String, default: null },
  },
  { timestamps: true }
);

// One report per pair
reportSchema.index({ reportedBy: 1, reportedUser: 1 }, { unique: true });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
