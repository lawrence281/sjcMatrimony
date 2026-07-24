const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OK, CREATED, BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = require('../constants/statusCodes');
const { AUTH, GENERAL } = require('../constants/messages');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(BAD_REQUEST).json({ success: false, message: AUTH.EMAIL_IN_USE });
    }
    const user = await User.create({ name, email, password, role: role || 'user', location: location || {} });
    res.status(CREATED).json({
      success: true,
      token: generateToken(user._id),
      message: AUTH.REGISTER_SUCCESS,
      user,
    });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(UNAUTHORIZED).json({ success: false, message: AUTH.INVALID_CREDENTIALS });
    }
    res.status(OK).json({
      success: true,
      token: generateToken(user._id),
      message: AUTH.LOGIN_SUCCESS,
      user,
    });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
