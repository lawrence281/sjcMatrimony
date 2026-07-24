const Category = require('../models/Category');
const { OK, CREATED, NOT_FOUND, INTERNAL_SERVER_ERROR, BAD_REQUEST } = require('../constants/statusCodes');
const { CATEGORY } = require('../constants/messages');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('-isActive name');
    res.status(OK).json({ success: true, categories });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Alphanumeric validation
    if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'Category name can only contain letters and numbers' });
    }

    // Duplicate name validation (Case-insensitive)
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'Category name already exists' });
    }

    // Basic slug generation
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const category = await Category.create({ name, description, slug, image });
    res.status(CREATED).json({ success: true, category, message: CATEGORY.CREATED });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(NOT_FOUND).json({ success: false, message: CATEGORY.NOT_FOUND });

    if (name && name !== category.name) {
      // Alphanumeric validation
      if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
        return res.status(BAD_REQUEST).json({ success: false, message: 'Category name can only contain letters and numbers' });
      }

      // Duplicate name validation
      const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      if (existing) {
        return res.status(BAD_REQUEST).json({ success: false, message: 'Category name already exists' });
      }
      category.name = name;
      category.slug = name.toLowerCase().replace(/\s+/g, '-');
    }

    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;
    if (req.file) {
      category.image = `/uploads/${req.file.filename}`;
    } else if (req.body.imageRemoved === 'true') {
      category.image = '';
    }

    await category.save();
    res.status(OK).json({ success: true, category });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// Toggle toggle status which is specifically requested as a feature
const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(NOT_FOUND).json({ success: false, message: CATEGORY.NOT_FOUND });
    category.isActive = !category.isActive;
    await category.save();
    res.status(OK).json({ success: true, category, message: `Category status updated to ${category.isActive ? 'Active' : 'Inactive'}` });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, toggleCategoryStatus };
