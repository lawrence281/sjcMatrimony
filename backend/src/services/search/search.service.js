const profileRepository = require('../../repositories/profile.repository');
const Profile = require('../../models/Profile.model');
const { PROFILE_STATUS } = require('../../constants/profileStatus');
const { GENDER } = require('../../constants/gender');

/**
 * Search Service
 * Builds dynamic filters and executes aggregate searches on user profiles.
 */
const searchService = {
  /**
   * Searches user profiles using aggregate matching, joins primary gallery photo, and paginates.
   *
   * @param {Object} query - Filter parameters
   * @param {Object} currentUser - Requesting User details
   * @returns {Promise<{ profiles: Array, total: number, page: number, limit: number }>}
   */
  async searchProfiles(query, currentUser) {
    const { page = 1, limit = 10, sort = 'recent' } = query;
    const skip = (page - 1) * limit;

    const matchStage = {
      status: { $in: [PROFILE_STATUS.APPROVED, PROFILE_STATUS.ACTIVE] },
    };

    // Exclude current user from search
    if (currentUser) {
      matchStage.userId = { $ne: currentUser._id };
    }

    // Smart default gender: search for opposite gender of current user
    let searchGender = query.gender;
    if (!searchGender && currentUser) {
      const myProfile = await profileRepository.findByUserId(currentUser._id);
      if (myProfile) {
        searchGender = myProfile.gender === GENDER.MALE ? GENDER.FEMALE : GENDER.MALE;
      }
    }

    if (searchGender) {
      matchStage.gender = searchGender;
    }

    // Range Filters: Age
    if (query.minAge || query.maxAge) {
      matchStage.age = {};
      if (query.minAge) matchStage.age.$gte = parseInt(query.minAge, 10);
      if (query.maxAge) matchStage.age.$lte = parseInt(query.maxAge, 10);
    }

    // Range Filters: Height
    if (query.minHeight || query.maxHeight) {
      matchStage.height = {};
      if (query.minHeight) matchStage.height.$gte = parseFloat(query.minHeight);
      if (query.maxHeight) matchStage.height.$lte = parseFloat(query.maxHeight);
    }

    // Categorical matches
    if (query.religion) {
      matchStage.religion = query.religion;
    }
    if (query.caste) {
      matchStage.caste = { $regex: query.caste, $options: 'i' };
    }
    if (query.maritalStatus) {
      matchStage.maritalStatus = query.maritalStatus;
    }
    if (query.education) {
      matchStage.education = query.education;
    }
    if (query.occupation) {
      matchStage.occupation = query.occupation;
    }

    // Income threshold
    if (query.minIncome) {
      matchStage.annualIncome = { $gte: parseFloat(query.minIncome) };
    }

    // Location matches
    if (query.city) {
      matchStage.city = { $regex: query.city, $options: 'i' };
    }
    if (query.state) {
      matchStage.state = { $regex: query.state, $options: 'i' };
    }
    if (query.country) {
      matchStage.country = { $regex: query.country, $options: 'i' };
    }

    // Sorting configurations
    let sortStage = { createdAt: -1 }; // default
    if (sort === 'age_asc') {
      sortStage = { age: 1 };
    } else if (sort === 'age_desc') {
      sortStage = { age: -1 };
    } else if (sort === 'income_desc') {
      sortStage = { annualIncome: -1 };
    }

    const profiles = await profileRepository.searchProfiles(
      matchStage,
      sortStage,
      skip,
      limit
    );

    const total = await Profile.countDocuments(matchStage);

    return {
      profiles,
      total,
      page,
      limit,
    };
  },
};

module.exports = searchService;
