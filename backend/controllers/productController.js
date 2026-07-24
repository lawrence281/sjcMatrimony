const Product = require('../models/Product');
const Category = require('../models/Category');
const { OK, CREATED, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../constants/statusCodes');
const { PRODUCT } = require('../constants/messages');
const path = require('path');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const {
      category, minPrice, maxPrice, rating, search,
      featured, badge, isCombo, page = 1, limit = 12, sort = '-createdAt',
      showAll = 'false'
    } = req.query;

    const filter = showAll === 'true' ? {} : { isActive: true };
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      filter.price = priceFilter;
    }
    if (rating) filter.averageRating = { $gte: Number(rating) };
    if (featured === 'true') filter.featured = true;
    if (badge) filter.badge = badge;
    if (isCombo === 'true') filter.isCombo = true;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const total = await Product.countDocuments(filter);
    // Sort by isActive (true/1 first) then by the requested sort
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort('-isActive ' + sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(OK).json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('ratings.user', 'name avatar');
    if (!product) return res.status(NOT_FOUND).json({ success: false, message: PRODUCT.NOT_FOUND });
    res.status(OK).json({ success: true, product });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// POST /api/products (admin)
const createProduct = async (req, res) => {
  try {
    const { 
      name, description, price, originalPrice, category, 
      stock, featured, isCombo, safetyInformation, type, noiseLevel, availabilityStatus 
    } = req.body;

    let finalImages = [];
    if (req.body.images) {
      finalImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      finalImages = [...finalImages, ...newImages];
    }
    const images = finalImages;

    const product = await Product.create({
      name, description, price, originalPrice, category,
      images, stock, featured, isCombo: isCombo === 'true' || isCombo === true,
      safetyInformation, 
      type: type || 'Sparklers', 
      noiseLevel: noiseLevel || 'Medium', 
      availabilityStatus: availabilityStatus || 'In Stock'
    });
    const populated = await product.populate('category', 'name slug');
    res.status(CREATED).json({ success: true, product: populated, message: PRODUCT.CREATED });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    let combinedImages = [];
    if (req.body.images) {
      combinedImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      combinedImages = [...combinedImages, ...newImages];
    }
    updateData.images = combinedImages;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('category', 'name slug');
    if (!product) return res.status(NOT_FOUND).json({ success: false, message: PRODUCT.NOT_FOUND });
    res.status(OK).json({ success: true, product, message: PRODUCT.UPDATED });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// Toggle status (admin only)
const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(NOT_FOUND).json({ success: false, message: PRODUCT.NOT_FOUND });
    product.isActive = !product.isActive;
    await product.save();
    const populated = await product.populate('category', 'name slug');
    res.status(OK).json({ success: true, product: populated, message: `Product status set to ${product.isActive ? 'Active' : 'Inactive'}` });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// POST /api/products/:id/rate
const rateProduct = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const existing = product.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existing) {
      existing.rating = rating;
      existing.review = review || existing.review;
    } else {
      product.ratings.push({ user: req.user._id, rating, review: review || '' });
    }
    product.updateRating();
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, toggleProductStatus, rateProduct };
