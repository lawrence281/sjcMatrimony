const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subscription name is required'],
      trim: true,
    },
    planType: {
      type: String,
      enum: ['free', 'basic', 'standard', 'premium', 'vip', 'custom'],
      default: 'standard',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1'],
    },
    durationUnit: {
      type: String,
      enum: ['days', 'months', 'years'],
      default: 'months',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    maxContactRequests: {
      type: Number,
      default: -1, // -1 means unlimited
    },
    maxProfileViews: {
      type: Number,
      default: -1, // -1 means unlimited
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.index({ status: 1, displayOrder: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
