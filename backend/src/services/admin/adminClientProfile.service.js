const bcrypt = require('bcryptjs');
const userRepository = require('../../repositories/user.repository');
const profileRepository = require('../../repositories/profile.repository');
const ApiError = require('../../utils/ApiError');
const { STATUS } = require('../../statusCodes/error');
const { AUTH_MESSAGES } = require('../../messages/authMessages');
const { ADMIN_MESSAGES } = require('../../messages/adminMessages');
const { PROFILE_STATUS } = require('../../constants/profileStatus');
const { ROLES } = require('../../constants/roles');
const { calculateAge, generateProfileId } = require('../../utils/helpers');
const { appEvents, APP_EVENTS } = require('../../events/eventEmitter');
const logger = require('../../utils/logger');

const BCRYPT_ROUNDS = 12;

/**
 * Admin Client Profile Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles the full lifecycle of matrimony client profiles created by admin.
 * A "client profile" consists of TWO linked documents:
 *   1. User    → credentials, role, contact info
 *   2. Profile → personal, family, professional details
 *
 * Key behaviours:
 *   • Unified create: User + Profile in one atomic-like operation with rollback
 *   • WhatsApp notification fired asynchronously via appEvents after DB success
 *   • WhatsApp failure NEVER rolls back or affects profile creation
 *   • Sensitive fields (passwordHash, tokens) stripped before returning
 */
const adminClientProfileService = {
  // ── List ───────────────────────────────────────────────────────────────────

  /**
   * Returns a paginated, filterable list of client profiles.
   *
   * @param {Object} query - { page, limit, status, gender, search, sort }
   * @returns {Promise<{ profiles: Array, total: number, page: number, limit: number }>}
   */
  async listClientProfiles(query) {
    const { page = 1, limit = 10, status, gender, search, sort = '-createdAt' } = query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const filter = {};
    if (status) filter.status = status;
    if (gender) filter.gender = gender;

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { profileId: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = {};
    if (sort.startsWith('-')) {
      sortOption[sort.substring(1)] = -1;
    } else {
      sortOption[sort] = 1;
    }

    const profiles = await profileRepository.model
      .find(filter)
      .populate('userId', 'email phone role isActive isEmailVerified createdAt')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean();

    const total = await profileRepository.count(filter);

    return {
      profiles,
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
  },

  // ── Read ───────────────────────────────────────────────────────────────────

  /**
   * Retrieves a single client profile with populated user data.
   *
   * @param {string} profileId - MongoDB ObjectId
   * @returns {Promise<Object>}
   */
  async getClientProfileById(profileId) {
    const profile = await profileRepository.model
      .findById(profileId)
      .populate('userId', 'email phone role isActive isEmailVerified createdAt createdBy')
      .lean();

    if (!profile) {
      throw new ApiError(STATUS.NOT_FOUND, ADMIN_MESSAGES.CLIENT_PROFILE_NOT_FOUND);
    }

    return profile;
  },

  // ── Create ─────────────────────────────────────────────────────────────────

  /**
   * Creates a new client User account + Profile in one operation.
   * Fires the ADMIN_PROFILE_CREATED event after both documents are saved.
   *
   * @param {Object} data      - Combined user + profile fields from validated body
   * @param {string} adminId   - ID of the admin performing the action
   * @returns {Promise<{ user: Object, profile: Object, whatsapp: { queued: boolean } }>}
   */
  async createClientProfile(data, adminId) {
    const {
      // User account fields
      email,
      phone,
      password,
      // Profile fields (all remaining)
      ...profileData
    } = data;

    // ── 1. Check for duplicate email or phone ──────────────────────────────
    const existing = await userRepository.findByEmailOrPhone(email, phone);
    if (existing) {
      if (existing.email === email.toLowerCase()) {
        throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.PHONE_ALREADY_EXISTS);
    }

    // ── 2. Hash password ───────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // ── 3. Create User document ────────────────────────────────────────────
    let user;
    try {
      user = await userRepository.create({
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        passwordHash,
        role: ROLES.CLIENT,
        isEmailVerified: true,   // Admin-created accounts are pre-verified
        isPhoneVerified: true,
        isActive: true,
        createdBy: adminId,
      });
    } catch (err) {
      logger.error(`adminClientProfileService.createClientProfile: User creation failed — ${err.message}`);
      throw new ApiError(STATUS.SERVER_ERROR, 'Failed to create user account. Please try again.');
    }

    // ── 4. Create Profile document (rollback user if this fails) ───────────
    let profile;
    try {
      const age = calculateAge(profileData.dateOfBirth);
      const count = await profileRepository.count({});
      const profileId = generateProfileId(count + 1);

      profile = await profileRepository.create({
        ...profileData,
        userId: user._id,
        profileId,
        age,
        status: PROFILE_STATUS.APPROVED,   // Admin-created = immediately active
        isVerified: true,
        approvedBy: adminId,
        approvedAt: new Date(),
      });
    } catch (err) {
      // Rollback: remove the user we just created to prevent orphaned records
      logger.error(
        `adminClientProfileService.createClientProfile: Profile creation failed — ${err.message}. Rolling back user ${user._id}.`
      );
      await userRepository.deleteById(user._id).catch((rollbackErr) => {
        logger.error(`Rollback failed for user ${user._id}: ${rollbackErr.message}`);
      });
      throw new ApiError(STATUS.SERVER_ERROR, 'Failed to create profile. Please try again.');
    }

    // ── 5. Emit async WhatsApp onboarding event ────────────────────────────
    //    This fires AFTER both DB writes succeed.
    //    The listener handles it asynchronously — profile creation does not wait.
    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
    appEvents.emit(APP_EVENTS.ADMIN_PROFILE_CREATED, {
      userId: user._id.toString(),
      phone: phone.trim(),
      name: fullName,
      profileId: profile.profileId,
    });

    logger.info(
      `Admin client profile created | ProfileID: ${profile.profileId} | UserID: ${user._id} | By: ${adminId}`
    );

    // ── 6. Return safe user + profile ──────────────────────────────────────
    const safeUser = user.toObject();
    delete safeUser.passwordHash;
    delete safeUser.refreshToken;
    delete safeUser.refreshTokenExpiry;
    delete safeUser.passwordResetToken;
    delete safeUser.passwordResetExpiry;

    return {
      user: safeUser,
      profile: profile.toObject ? profile.toObject() : profile,
      whatsapp: { queued: true }, // Inform the admin UI the message was dispatched
    };
  },

  // ── Update ─────────────────────────────────────────────────────────────────

  /**
   * Updates an existing client profile and optionally the linked user account.
   *
   * @param {string} profileId  - MongoDB ObjectId of the Profile document
   * @param {Object} data       - Mixed update data (user + profile fields)
   * @param {string} adminId    - ID of the admin performing the action
   * @returns {Promise<Object>} Updated profile populated with user data
   */
  async updateClientProfile(profileId, data, adminId) {
    // ── Fetch the existing profile ─────────────────────────────────────────
    const profile = await profileRepository.model
      .findById(profileId)
      .lean();

    if (!profile) {
      throw new ApiError(STATUS.NOT_FOUND, ADMIN_MESSAGES.CLIENT_PROFILE_NOT_FOUND);
    }

    // ── Separate user-level vs profile-level fields ────────────────────────
    const { email, phone, isActive, ...profileFields } = data;
    const userUpdateFields = {};

    if (email !== undefined) {
      const emailLower = email.toLowerCase();
      if (emailLower !== profile.userId?.email) {
        const emailExists = await userRepository.findByEmail(emailLower);
        if (emailExists && emailExists._id.toString() !== profile.userId.toString()) {
          throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
        }
        userUpdateFields.email = emailLower;
      }
    }

    if (phone !== undefined) {
      const phoneExists = await userRepository.findByPhone(phone);
      if (phoneExists && phoneExists._id.toString() !== profile.userId.toString()) {
        throw new ApiError(STATUS.CONFLICT, AUTH_MESSAGES.PHONE_ALREADY_EXISTS);
      }
      userUpdateFields.phone = phone;
    }

    if (isActive !== undefined) {
      userUpdateFields.isActive = isActive;
    }

    // ── Update user if any user fields changed ─────────────────────────────
    if (Object.keys(userUpdateFields).length > 0) {
      await userRepository.updateById(profile.userId, userUpdateFields);
    }

    // ── Update profile fields ──────────────────────────────────────────────
    if (profileFields.dateOfBirth) {
      profileFields.age = calculateAge(profileFields.dateOfBirth);
    }

    const updatedProfile = await profileRepository.model
      .findByIdAndUpdate(profileId, profileFields, { new: true, runValidators: true })
      .populate('userId', 'email phone role isActive isEmailVerified createdAt')
      .lean();

    logger.info(
      `Admin client profile updated | ProfileID: ${profile.profileId} | By: ${adminId}`
    );

    return updatedProfile;
  },

  // ── Delete (soft) ──────────────────────────────────────────────────────────

  /**
   * Soft-deletes a client profile by marking it as DELETED and deactivating the user.
   * Does NOT remove data from the database to preserve audit trails.
   *
   * @param {string} profileId - MongoDB ObjectId of the Profile document
   * @param {string} adminId   - ID of the admin performing the action
   * @returns {Promise<{ message: string }>}
   */
  async deleteClientProfile(profileId, adminId) {
    const profile = await profileRepository.findById(profileId);
    if (!profile) {
      throw new ApiError(STATUS.NOT_FOUND, ADMIN_MESSAGES.CLIENT_PROFILE_NOT_FOUND);
    }

    // Soft delete profile
    await profileRepository.updateById(profileId, { status: PROFILE_STATUS.DELETED });

    // Deactivate the associated user account
    await userRepository.updateById(profile.userId, { isActive: false });

    logger.info(
      `Admin client profile soft-deleted | ProfileID: ${profile.profileId} | By: ${adminId}`
    );

    return { message: ADMIN_MESSAGES.CLIENT_PROFILE_DELETED };
  },
};

module.exports = adminClientProfileService;
