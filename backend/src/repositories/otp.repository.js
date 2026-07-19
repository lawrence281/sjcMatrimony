const BaseRepository = require('./base.repository');
const Otp = require('../models/Otp.model');

class OtpRepository extends BaseRepository {
  constructor() {
    super(Otp);
  }

  async findValidOtp(userId, purpose) {
    return this.model
      .findOne({
        userId,
        purpose,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      })
      .select('+otp')
      .lean();
  }

  async invalidateOtps(userId, purpose) {
    return this.model.updateMany(
      { userId, purpose, isUsed: false },
      { isUsed: true }
    );
  }

  async incrementAttempts(otpId) {
    return this.model.findByIdAndUpdate(otpId, { $inc: { attempts: 1 } }, { new: true });
  }

  async markUsed(otpId) {
    return this.model.findByIdAndUpdate(otpId, { isUsed: true });
  }
}

module.exports = new OtpRepository();
