const crypto = require('crypto');
const { Plan, Subscription } = require('../../models/Subscription.model');
const Payment = require('../../models/Payment.model');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { PAYMENT_STATUS, PAYMENT_GATEWAY } = require('../../constants/paymentStatus');
const { SUBSCRIPTION_STATUS } = require('../../constants/subscriptionTiers');

/**
 * Payment Service
 * Simulates Razorpay Order Creation and Signature verification natively.
 */
const paymentService = {
  /**
   * Generates a checkout order for a subscription plan.
   *
   * @param {string} userId
   * @param {string} planId
   * @returns {Promise<Object>} Checkout Order parameters
   */
  async createOrder(userId, planId) {
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      throw new ApiError(STATUS.NOT_FOUND, 'Target subscription plan not found or inactive.');
    }

    const receipt = `rcpt_${crypto.randomBytes(8).toString('hex')}`;
    const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    const payment = await Payment.create({
      userId,
      planId,
      amount: plan.price,
      currency: plan.currency || 'INR',
      gateway: PAYMENT_GATEWAY.RAZORPAY,
      gatewayOrderId: orderId,
      status: PAYMENT_STATUS.CREATED,
      receipt,
    });

    return {
      id: orderId,
      amount: plan.price * 100, // in paise
      currency: plan.currency || 'INR',
      paymentId: payment._id,
      receipt,
    };
  },

  /**
   * Verifies Razorpay signature and activates corresponding subscription.
   *
   * @param {string} userId
   * @param {Object} verificationData
   * @returns {Promise<Object>} Verification result
   */
  async verifyPayment(userId, verificationData) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verificationData;

    // Retrieve pending payment record
    const payment = await Payment.findOne({
      gatewayOrderId: razorpay_order_id,
      status: PAYMENT_STATUS.CREATED,
    });

    if (!payment) {
      throw new ApiError(STATUS.NOT_FOUND, 'Pending order record not found.');
    }

    // Verify HMAC signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret';
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // For verification check (allowing mock fallback validation)
    const isMock = secret === 'mock_secret';
    if (!isMock && expectedSignature !== razorpay_signature) {
      payment.status = PAYMENT_STATUS.FAILED;
      await payment.save();
      throw new ApiError(STATUS.BAD_REQUEST, 'Invalid signature hash validation failed.');
    }

    // Update payment parameters
    payment.status = PAYMENT_STATUS.SUCCESS;
    payment.gatewayPaymentId = razorpay_payment_id;
    payment.gatewaySignature = razorpay_signature;
    payment.method = verificationData.method || 'upi';
    payment.gatewayResponse = verificationData;

    // Fetch Plan Details
    const plan = await Plan.findById(payment.planId);
    if (!plan) {
      throw new ApiError(STATUS.NOT_FOUND, 'Plan details missing for payment.');
    }

    // Expiry current user active subscriptions
    await Subscription.updateMany(
      { userId, status: SUBSCRIPTION_STATUS.ACTIVE },
      { $set: { status: SUBSCRIPTION_STATUS.EXPIRED } }
    );

    // Create new active user subscription
    const newSubscription = await Subscription.create({
      userId,
      planId: plan._id,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      startDate: new Date(),
      endDate: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000),
      featuresSnapshot: plan.features,
      autoRenew: true,
    });

    // Link subscription object to payment
    payment.subscriptionId = newSubscription._id;
    await payment.save();

    return {
      message: 'Payment verified and subscription activated successfully.',
      subscription: newSubscription,
    };
  },
};

module.exports = paymentService;
