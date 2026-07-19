const BaseRepository = require('./base.repository');
const Profile = require('../models/Profile.model');

class ProfileRepository extends BaseRepository {
  constructor() {
    super(Profile);
  }

  async findByUserId(userId, lean = true) {
    const query = this.model.findOne({ userId });
    return lean ? query.lean() : query;
  }

  async findByProfileId(profileId) {
    return this.model.findOne({ profileId }).lean();
  }

  async incrementProfileViews(profileId) {
    return this.model.findByIdAndUpdate(profileId, { $inc: { profileViews: 1 } });
  }

  async findApprovedProfiles(filter = {}, options = {}) {
    const { PROFILE_STATUS } = require('../constants/profileStatus');
    return this.find({ ...filter, status: PROFILE_STATUS.APPROVED }, options);
  }

  async searchProfiles(matchStage, sortStage, skip, limit) {
    return this.model.aggregate([
      { $match: matchStage },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'galleries',
          localField: '_id',
          foreignField: 'profileId',
          pipeline: [{ $match: { isPrimary: true } }, { $limit: 1 }],
          as: 'primaryImage',
        },
      },
      { $unwind: { path: '$primaryImage', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          firstName: 1, lastName: 1, age: 1, gender: 1, city: 1, state: 1,
          religion: 1, occupation: 1, education: 1, profilePicture: 1,
          maritalStatus: 1, profileId: 1, isVerified: 1,
          'primaryImage.imageUrl': 1,
        },
      },
    ]);
  }

  async getProfileStats() {
    return this.model.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
  }
}

module.exports = new ProfileRepository();
