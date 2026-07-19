const mongoose = require('mongoose');
const { PAYMENT_STATUS, PAYMENT_GATEWAY } = require('../constants/paymentStatus');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    gateway: {
      type: String,
      enum: Object.values(PAYMENT_GATEWAY),
      default: PAYMENT_GATEWAY.RAZORPAY,
    },
    // Gateway-specific identifiers
    gatewayOrderId: { type: String, index: true },
    gatewayPaymentId: { type: String, index: true, default: null },
    gatewaySignature: { type: String, select: false, default: null },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.CREATED,
      index: true,
    },
    method: { type: String, default: null }, // card, upi, netbanking, etc.
    receipt: { type: String },
    // Raw gateway response for debugging/reconciliation
    gatewayResponse: { type: mongoose.Schema.Types.Mixed, select: false },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, status: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
