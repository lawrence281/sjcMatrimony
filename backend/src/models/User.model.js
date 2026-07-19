const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../constants/roles');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [super_admin, admin, employee, relationship_manager, franchise, vendor, support, client]
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Never returned in queries unless explicitly selected
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CLIENT,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    // Refresh token stored hashed for security
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    refreshTokenExpiry: {
      type: Date,
      default: null,
      select: false,
    },
    // For password reset flow
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
      default: null,
      select: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ──────────────────────────────────────────────────────────
// Virtuals
// ──────────────────────────────────────────────────────────
userSchema.virtual('profile', {
  ref: 'Profile',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

// ──────────────────────────────────────────────────────────
// Instance Methods
// ──────────────────────────────────────────────────────────
/**
 * Compares a plain-text password against the stored hash.
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Returns a safe user object without sensitive fields.
 * @returns {Object}
 */
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  delete obj.refreshTokenExpiry;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpiry;
  return obj;
};

// ──────────────────────────────────────────────────────────
// Indexes
// ──────────────────────────────────────────────────────────
userSchema.index({ email: 1, role: 1 });
userSchema.index({ phone: 1, isActive: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
