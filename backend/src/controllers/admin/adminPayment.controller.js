const adminPaymentService = require('../../services/admin/adminPayment.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../helpers/response.helper');
const { STATUS: SUCCESS } = require('../../statusCodes/success');

/**
 * Admin Payment Controller
 * Manages administrative query details on transaction logs.
 */
const adminPaymentController = {
  /**
   * GET /admin/payments
   * Lists transactions histories.
   */
  listPayments: catchAsync(async (req, res) => {
    const result = await adminPaymentService.listPayments(req.query);
    sendSuccess(res, SUCCESS.OK, 'Payments ledger retrieved successfully.', result.payments, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  }),
};

module.exports = adminPaymentController;
