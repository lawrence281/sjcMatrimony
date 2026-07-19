const mongoose = require('mongoose');
const { INTEREST_STATUS } = require('../constants/interestStatus');

const interestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(INTEREST_STATUS),
      default: INTEREST_STATUS.PENDING,
      index: true,
    },
    message: { type: String, maxlength: 500, default: null },
    rejectionReason: { type: String, default: null },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevent duplicate interest from same sender to same receiver
interestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
interestSchema.index({ receiverId: 1, status: 1 });
interestSchema.index({ senderId: 1, status: 1 });

const Interest = mongoose.model('Interest', interestSchema);
module.exports = Interest;
