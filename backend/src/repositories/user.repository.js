const BaseRepository = require('./base.repository');
const User = require('../models/User.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email, includePassword = false) {
    const select = includePassword ? '+passwordHash' : '';
    return this.model.findOne({ email: email.toLowerCase() }).select(select).lean();
  }

  async findByPhone(phone) {
    return this.model.findOne({ phone }).lean();
  }

  async findByEmailOrPhone(email, phone) {
    return this.model.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    }).lean();
  }

  async findByIdWithRefreshToken(id) {
    return this.model.findById(id).select('+refreshToken +refreshTokenExpiry').lean();
  }

  async updateRefreshToken(userId, refreshToken, expiry) {
    return this.model.findByIdAndUpdate(
      userId,
      { refreshToken, refreshTokenExpiry: expiry },
      { new: true }
    );
  }

  async clearRefreshToken(userId) {
    return this.model.findByIdAndUpdate(userId, {
      refreshToken: null,
      refreshTokenExpiry: null,
    });
  }

  async updateLastLogin(userId) {
    return this.model.findByIdAndUpdate(userId, { lastLogin: new Date() });
  }

  async findActiveUsers(options = {}) {
    return this.find({ isActive: true }, options);
  }

  async findByRole(role, options = {}) {
    return this.find({ role }, options);
  }
}

module.exports = new UserRepository();
