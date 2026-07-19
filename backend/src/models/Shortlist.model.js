const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    shortlistedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate shortlist entries
shortlistSchema.index({ userId: 1, shortlistedUserId: 1 }, { unique: true });

const Shortlist = mongoose.model('Shortlist', shortlistSchema);
module.exports = Shortlist;
