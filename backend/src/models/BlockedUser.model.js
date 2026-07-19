const mongoose = require('mongoose');

const blockedUserSchema = new mongoose.Schema(
  {
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    blockedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: { type: String, maxlength: 500, default: null },
  },
  { timestamps: true }
);

blockedUserSchema.index({ blockedBy: 1, blockedUser: 1 }, { unique: true });

const BlockedUser = mongoose.model('BlockedUser', blockedUserSchema);
module.exports = BlockedUser;
