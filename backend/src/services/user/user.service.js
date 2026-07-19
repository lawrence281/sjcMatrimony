const userRepository = require('../../repositories/user.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { USER_MESSAGES } = require('../../messages/userMessages');
const { AUTH_MESSAGES } = require('../../messages/authMessages');
const { ADMIN_ROLES } = require('../../constants/roles');

/**
 * User Service
 * Handles all user-related business logic.
 */
const userService = {
  /**
   * Retrieves a paginated list of users with filtering and sorting.
   *
   * @param {Object} query - Query parameters (page, limit, role, isActive, search, sort)
   * @returns {Promise<{ users: Array, total: number, page: number, limit: number }>}
   */
  async listUsers(query) {
    const { page = 1, limit = 10, role, isActive, search, sort = '-createdAt' } = query;

    const skip = (page - 1) * limit;
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Parse sort parameter
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

    // Map to safe objects (exclude sensitive fields)
    const safeUsers = users.map((user) => {
      const safeUser = { ...user };
      delete safeUser.passwordHash;
      delete safeUser.refreshToken;
      delete safeUser.refreshTokenExpiry;
      delete safeUser.passwordResetToken;
      delete safeUser.passwordResetExpiry;
      return safeUser;
    });

    return {
      users: safeUsers,
      total,
      page,
      limit,
    };
  },

  /**
   * Retrieves a single user by ID.
   *
   * @param {string} id - Target User ID
   * @returns {Promise<Object>} Safe user object
   */
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(STATUS.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }

    const safeUser = { ...user };
    delete safeUser.passwordHash;
    delete safeUser.refreshToken;
    delete safeUser.refreshTokenExpiry;
    delete safeUser.passwordResetToken;
    delete safeUser.passwordResetExpiry;

    return safeUser;
  },

  /**
   * Updates a user's details.
   *
   * @param {string} id - Target User ID
   * @param {Object} updateData - Fields to update
   * @param {Object} currentUser - Decoded user performing the action
   * @returns {Promise<Object>} Safe user object after update
   */
  async updateUser(id, updateData, currentUser) {
    const isSelf = currentUser._id === id;
    const isAdmin = ADMIN_ROLES.includes(currentUser.role);

    // 1. Access check: User can only update themselves, or Admin can update anyone
    if (!isSelf && !isAdmin) {
      throw new ApiError(STATUS.FORBIDDEN, AUTH_MESSAGES.FORBIDDEN || 'Insufficient permissions.');
    }

    // 2. Permission check: Only admins can update role/status
    if (!isAdmin) {
      if (updateData.role !== undefined || updateData.isActive !== undefined) {
        throw new ApiError(STATUS.FORBIDDEN, 'Only administrators can update user roles or active status.');
      }
    }

    // 3. Ensure target user exists
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(STATUS.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }

    const updateFields = {};

    // 4. Validate unique email if changed
    if (updateData.email && updateData.email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await userRepository.findByEmail(updateData.email);
      if (emailExists && emailExists._id.toString() !== id) {
        throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      updateFields.email = updateData.email.toLowerCase();
      updateFields.isEmailVerified = false;
    }

    // 5. Validate unique phone if changed
    if (updateData.phone && updateData.phone !== user.phone) {
      const phoneExists = await userRepository.findByPhone(updateData.phone);
      if (phoneExists && phoneExists._id.toString() !== id) {
        throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.PHONE_ALREADY_EXISTS);
      }
      updateFields.phone = updateData.phone;
      updateFields.isPhoneVerified = false;
    }

    // 6. Admin-only status/role changes
    if (updateData.role !== undefined) {
      updateFields.role = updateData.role;
    }

    if (updateData.isActive !== undefined) {
      updateFields.isActive = updateData.isActive;
    }

    const updatedUser = await userRepository.updateById(id, updateFields);

    const safeUser = { ...updatedUser };
    delete safeUser.passwordHash;
    delete safeUser.refreshToken;
    delete safeUser.refreshTokenExpiry;
    delete safeUser.passwordResetToken;
    delete safeUser.passwordResetExpiry;

    return safeUser;
  },

  /**
   * Deletes a user by ID.
   *
   * @param {string} id - Target User ID
   * @param {Object} currentUser - User performing the deletion
   * @returns {Promise<Object>} Deletion result
   */
  async deleteUser(id, currentUser) {
    const isAdmin = ADMIN_ROLES.includes(currentUser.role);
    if (!isAdmin) {
      throw new ApiError(STATUS.FORBIDDEN, AUTH_MESSAGES.FORBIDDEN || 'Insufficient permissions.');
    }

    // Prevent self-deletion
    if (currentUser._id === id) {
      throw new ApiError(STATUS.BAD_REQUEST, USER_MESSAGES.CANNOT_DELETE_SELF);
    }

    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(STATUS.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }

    await userRepository.deleteById(id);

    return { message: USER_MESSAGES.USER_DELETED };
  },
};

module.exports = userService;
