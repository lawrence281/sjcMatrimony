const PAYMENT_STATUS = Object.freeze({
  CREATED: 'created',
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
});

const PAYMENT_GATEWAY = Object.freeze({
  RAZORPAY: 'razorpay',
  STRIPE: 'stripe',
});

module.exports = { PAYMENT_STATUS, PAYMENT_GATEWAY };
