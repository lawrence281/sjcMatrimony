const mongoose = require('mongoose');
const { GENDER } = require('../constants/gender');
const { PROFILE_STATUS } = require('../constants/profileStatus');
const { MARITAL_STATUS } = require('../constants/maritalStatus');
const { RELIGION } = require('../constants/religion');
const { EDUCATION } = require('../constants/education');
const { OCCUPATION } = require('../constants/occupation');
const { BLOOD_GROUP } = require('../constants/bloodGroup');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    // Human-readable ID for display (MAT-00001)
    profileId: {
      type: String,
      unique: true,
      index: true,
    },

    // ── Personal Information ──────────────────────────────
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, index: true }, // Derived, stored for query performance
    gender: {
      type: String,
      enum: Object.values(GENDER),
      required: true,
      index: true,
    },
    height: { type: Number }, // In centimeters
    weight: { type: Number }, // In kilograms
    complexion: {
      type: String,
      enum: ['very_fair', 'fair', 'wheatish', 'dark', 'very_dark'],
    },
    bodyType: {
      type: String,
      enum: ['slim', 'athletic', 'average', 'heavy'],
    },
    bloodGroup: {
      type: String,
      enum: Object.values(BLOOD_GROUP),
    },
    physicalStatus: {
      type: String,
      enum: ['normal', 'physically_challenged'],
      default: 'normal',
    },

    // ── Biographical ──────────────────────────────────────
    maritalStatus: {
      type: String,
      enum: Object.values(MARITAL_STATUS),
      required: true,
      index: true,
    },
    havingChildren: { type: Boolean, default: false },
    numberOfChildren: { type: Number, default: 0 },
    aboutMe: { type: String, maxlength: 1000 },
    hobbies: [{ type: String }],

    // ── Religious & Cultural ─────────────────────────────
    religion: {
      type: String,
      enum: Object.values(RELIGION),
      index: true,
    },
    caste: { type: String, trim: true, index: true },
    subCaste: { type: String, trim: true },
    gotra: { type: String, trim: true },
    manglik: {
      type: String,
      enum: ['yes', 'no', 'partial', 'dont_know'],
      default: 'dont_know',
    },
    motherTongue: { type: String, index: true },
    languages: [{ type: String }],

    // ── Location ─────────────────────────────────────────
    nationality: { type: String, default: 'Indian' },
    country: { type: String, index: true },
    state: { type: String, index: true },
    city: { type: String, index: true },
    residencyStatus: {
      type: String,
      enum: ['citizen', 'permanent_resident', 'student_visa', 'work_permit', 'other'],
    },

    // ── Education & Career ────────────────────────────────
    education: {
      type: String,
      enum: Object.values(EDUCATION),
      index: true,
    },
    educationDetails: { type: String },
    institution: { type: String },
    occupation: {
      type: String,
      enum: Object.values(OCCUPATION),
      index: true,
    },
    occupationDetails: { type: String },
    employer: { type: String },
    annualIncome: { type: Number, index: true }, // In INR
    workLocation: { type: String },

    // ── Family ───────────────────────────────────────────
    fatherName: { type: String },
    fatherOccupation: { type: String },
    motherName: { type: String },
    motherOccupation: { type: String },
    numberOfBrothers: { type: Number, default: 0 },
    numberOfSisters: { type: Number, default: 0 },
    familyType: {
      type: String,
      enum: ['joint', 'nuclear', 'extended'],
    },
    familyStatus: {
      type: String,
      enum: ['middle_class', 'upper_middle_class', 'rich', 'affluent'],
    },
    familyValues: {
      type: String,
      enum: ['traditional', 'moderate', 'liberal'],
    },
    familyLocation: { type: String },

    // ── Lifestyle ─────────────────────────────────────────
    diet: {
      type: String,
      enum: ['vegetarian', 'non_vegetarian', 'eggetarian', 'vegan', 'jain'],
    },
    smoke: { type: String, enum: ['yes', 'no', 'occasionally'] },
    drink: { type: String, enum: ['yes', 'no', 'occasionally'] },

    // ── Profile Media ─────────────────────────────────────
    profilePicture: { type: String, default: null }, // Cloudinary URL
    isHoroscopeAvailable: { type: Boolean, default: false },
    horoscopeUrl: { type: String, default: null },

    // ── Status & Visibility ───────────────────────────────
    status: {
      type: String,
      enum: Object.values(PROFILE_STATUS),
      default: PROFILE_STATUS.PENDING,
      index: true,
    },
    isVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    profileViews: { type: Number, default: 0 },
    privacySettings: {
      showPhone: { type: Boolean, default: false },
      showEmail: { type: Boolean, default: false },
      showLastSeen: { type: Boolean, default: true },
    },

    // ── Admin Fields ──────────────────────────────────────
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
    adminNotes: { type: String, default: null },
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
profileSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

profileSchema.virtual('gallery', {
  ref: 'Gallery',
  localField: '_id',
  foreignField: 'profileId',
});

profileSchema.virtual('partnerPreference', {
  ref: 'PartnerPreference',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true,
});

// ──────────────────────────────────────────────────────────
// Compound Indexes for search performance
// ──────────────────────────────────────────────────────────
profileSchema.index({ gender: 1, status: 1, religion: 1 });
profileSchema.index({ gender: 1, status: 1, caste: 1 });
profileSchema.index({ gender: 1, status: 1, age: 1 });
profileSchema.index({ gender: 1, status: 1, annualIncome: 1 });
profileSchema.index({ gender: 1, status: 1, country: 1, state: 1 });
profileSchema.index({ status: 1, createdAt: -1 });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
