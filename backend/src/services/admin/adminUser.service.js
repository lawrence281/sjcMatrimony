const bcrypt = require('bcryptjs');
const userRepository = require('../../repositories/user.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { USER_MESSAGES } = require('../../messages/userMessages');
const { AUTH_MESSAGES } = require('../../messages/authMessages');
const { ADMIN_ROLES } = require('../../constants/roles');

const BCRYPT_ROUNDS = 12;

/**
 * Admin User Service
 * Manages operations on administrative portal user accounts (staff/employee roles).
 */
const adminUserService = {
  /**
   * Lists administrative staff users (excluding clients).
   *
   * @param {Object} query - Filtering & pagination parameters
   * @returns {Promise<{ users: Array, total: number, page: number, limit: number }>}
   */
  async listAdminUsers(query) {
    const { page = 1, limit = 10, role, search, sort = '-createdAt' } = query;
    const skip = (page - 1) * limit;

    // Filter strictly to admin roles only
    const filter = {
      role: role ? role : { $in: ADMIN_ROLES },
    };

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = {};
    if (sort) {
      if (sort.startsWith('-')) {
        sortOption[sort.substring(1)] = -1;
      } else {
        sortOption[sort] = 1;
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    const users = await userRepository.find(filter, {
      sort: sortOption,
      skip,
      limit,
    });

    const total = await userRepository.count(filter);

    const safeUsers = users.map((user) => {
      const safe = { ...user };
      delete safe.passwordHash;
      delete safe.refreshToken;
      delete safe.refreshTokenExpiry;
      delete safe.passwordResetToken;
      delete safe.passwordResetExpiry;
      return safe;
    });

    return {
      users: safeUsers,
      total,
      page,
      limit,
    };
  },

  /**
   * Registers a new administrative staff account (pre-verified).
   *
   * @param {Object} data - Account information
   * @param {string} creatorId - User ID of creator
   * @returns {Promise<Object>} Safe user object
   */
  async createAdminUser(data, creatorId) {
    const { email, phone, password, role } = data;

    const existing = await userRepository.findByEmailOrPhone(email, phone);
    if (existing) {
      if (existing.email === email.toLowerCase()) {
        throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.PHONE_ALREADY_EXISTS);
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await userRepository.create({
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      passwordHash,
      role,
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      createdBy: creatorId,
    });

    const safe = user.toObject();
    delete safe.passwordHash;
    delete safe.refreshToken;
    delete safe.refreshTokenExpiry;
    delete safe.passwordResetToken;
    delete safe.passwordResetExpiry;

    return safe;
  },

  /**
   * Updates administrative staff details.
   *
   * @param {string} id - Target User ID
   * @param {Object} updateData - Updated parameters
   * @returns {Promise<Object>} Safe user object
   */
  async updateAdminUser(id, updateData) {
    const user = await userRepository.findById(id);
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      throw new ApiError(STATUS.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }

    const updateFields = {};

    if (updateData.email && updateData.email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await userRepository.findByEmail(updateData.email);
      if (emailExists && emailExists._id.toString() !== id) {
        throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      updateFields.email = updateData.email.toLowerCase();
    }

    if (updateData.phone && updateData.phone !== user.phone) {
      const phoneExists = await userRepository.findByPhone(updateData.phone);
      if (phoneExists && phoneExists._id.toString() !== id) {
        throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.PHONE_ALREADY_EXISTS);
      }
      updateFields.phone = updateData.phone;
    }

    if (updateData.role !== undefined) {
      updateFields.role = updateData.role;
    }

    if (updateData.isActive !== undefined) {
      updateFields.isActive = updateData.isActive;
    }

    const updatedUser = await userRepository.updateById(id, updateFields);

    const safe = { ...updatedUser };
    delete safe.passwordHash;
    delete safe.refreshToken;
    delete safe.refreshTokenExpiry;
    delete safe.passwordResetToken;
    delete safe.passwordResetExpiry;

    return safe;
  },

  /**
   * Toggles the active status of an administrative account.
   *
   * @param {string} id - Target User ID
   * @returns {Promise<Object>} Safe user object
   */
  async toggleUserStatus(id) {
    const user = await userRepository.findById(id);
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      throw new ApiError(STATUS.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }

    const updatedUser = await userRepository.updateById(id, { isActive: !user.isActive });

    const safe = { ...updatedUser };
    delete safe.passwordHash;
    delete safe.refreshToken;
    delete safe.refreshTokenExpiry;
    delete safe.passwordResetToken;
    delete safe.passwordResetExpiry;

    return safe;
  },

  /**
   * Removes an administrative account (preventing self-deletion).
   *
   * @param {string} id - Target User ID
   * @param {string} currentUserId - Active Administrator ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteAdminUser(id, currentUserId) {
    if (id === currentUserId) {
      throw new ApiError(STATUS.BAD_REQUEST, USER_MESSAGES.CANNOT_DELETE_SELF);
    }

    const user = await userRepository.findById(id);
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      throw new ApiError(STATUS.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }

    await userRepository.deleteById(id);

    return { message: USER_MESSAGES.USER_DELETED };
  },
};

module.exports = adminUserService;
