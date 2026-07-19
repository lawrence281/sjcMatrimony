const mongoose = require('mongoose');
const { SUBSCRIPTION_TIERS, SUBSCRIPTION_STATUS } = require('../constants/subscriptionTiers');

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tier: {
      type: String,
      enum: Object.values(SUBSCRIPTION_TIERS),
      required: true,
      unique: true,
    },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    durationDays: { type: Number, required: true },
    features: {
      interestsPerDay: { type: Number, default: 3 },
      canViewContact: { type: Boolean, default: false },
      canViewGallery: { type: Boolean, default: false },
      canChat: { type: Boolean, default: false },
      maxShortlist: { type: Number, default: 10 },
      profileBoost: { type: Boolean, default: false },
      dedicatedRM: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true }
);

const Plan = mongoose.model('Plan', planSchema);

// ──────────────────────────────────────────────────────────

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.PENDING,
      index: true,
    },
    startDate: { type: Date },
    endDate: { type: Date, index: true },
    autoRenew: { type: Boolean, default: false },
    // Snapshot of plan features at time of purchase (plan may change later)
    featuresSnapshot: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 }); // For cron job queries

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = { Plan, Subscription };
