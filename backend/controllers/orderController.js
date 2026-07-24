const Order = require('../models/Order');
const Product = require('../models/Product');
const { CREATED, OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../constants/statusCodes');
const { ORDER } = require('../constants/messages');
const { sendOrderNotification } = require('../services/whatsappService');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, tax, shipping, total, promoCode, discount, guestEmail } = req.body;

    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      guestEmail: req.user ? '' : (guestEmail || ''),
      items, shippingAddress, paymentMethod,
      subtotal, tax, shipping, total, promoCode, discount,
    });

    // Increment sales count for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { salesCount: item.quantity } });
    }

    const populated = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'name images');

    // Send WhatsApp notification
    sendOrderNotification(populated).catch(err => console.log('WhatsApp notification failed:', err.message));

    res.status(CREATED).json({ success: true, order: populated, message: ORDER.CREATED });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// GET /api/orders (admin - all orders)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    res.status(OK).json({ success: true, orders, total });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// GET /api/orders/my (user's own orders)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images price')
      .sort('-createdAt');
    res.status(OK).json({ success: true, orders });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images price');
    if (!order) return res.status(NOT_FOUND).json({ success: false, message: ORDER.NOT_FOUND });
    res.status(OK).json({ success: true, order });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// PUT /api/orders/:id/status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('user', 'name email');
    if (!order) return res.status(NOT_FOUND).json({ success: false, message: ORDER.NOT_FOUND });
    res.status(OK).json({ success: true, order, message: ORDER.UPDATED });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getAllOrders, getMyOrders, getOrder, updateOrderStatus };
