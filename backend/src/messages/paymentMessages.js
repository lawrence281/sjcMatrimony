const PAYMENT_MESSAGES = Object.freeze({
  ORDER_CREATED: 'Payment order created successfully.',
  PAYMENT_VERIFIED: 'Payment verified and subscription activated.',
  PAYMENT_FAILED: 'Payment verification failed. Please try again.',
  PAYMENT_FETCHED: 'Payment details fetched successfully.',
  PAYMENTS_FETCHED: 'Payment history fetched successfully.',
  PAYMENT_NOT_FOUND: 'Payment record not found.',
  REFUND_INITIATED: 'Refund initiated successfully.',
  INVALID_SIGNATURE: 'Invalid payment signature. Possible tampering detected.',
});

module.exports = { PAYMENT_MESSAGES };
