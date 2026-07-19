const mongoose = require('mongoose');
const { OTP_PURPOSE, OTP_EXPIRY_MINUTES } = require('../constants/otpPurpose');

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
      select: false, // Never returned in queries
    },
    purpose: {
      type: String,
      enum: Object.values(OTP_PURPOSE),
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index: MongoDB auto-deletes documents after expiry
      index: { expireAfterSeconds: 0 },
    },
    isUsed: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    deliveredTo: { type: String }, // Phone number or email for audit
  },
  { timestamps: true }
);

otpSchema.index({ userId: 1, purpose: 1 });

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
