const mongoose = require('mongoose');

// ─────────────────────────────────────────────
// Sub-schemas
// ─────────────────────────────────────────────
const galleryPhotoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, default: '' },
  uploadedAt: { type: Date, default: Date.now },
});

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['idProof', 'baptismCertificate', 'other'],
    required: true,
  },
  label: { type: String, default: '' },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

// ─────────────────────────────────────────────
// Main Profile Schema
// ─────────────────────────────────────────────
const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // ── 1. Basic Information ──────────────────
    profileFor: {
      type: String,
      enum: ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend'],
      default: 'Self',
    },
    firstName: { type: String, trim: true, default: '' },
    lastName: { type: String, trim: true, default: '' },
    gender: { type: String, enum: ['Male', 'Female', ''], default: '' },
    dateOfBirth: { type: Date, default: null },
    mobileNumber: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    profileImage: { type: String, default: '' },
    coverImage: { type: String, default: '' },

    // ── 2. Religious Information ──────────────
    religion: { type: String, default: 'Christian' },
    denomination: { type: String, trim: true, default: '' },
    diocese: { type: String, trim: true, default: '' },
    parish: { type: String, trim: true, default: '' },
    church: { type: String, trim: true, default: '' },
    baptismName: { type: String, trim: true, default: '' },
    confirmationName: { type: String, trim: true, default: '' },

    // ── 3. Personal Information ───────────────
    maritalStatus: {
      type: String,
      enum: ['Never Married', 'Divorced', 'Widowed', 'Separated', ''],
      default: '',
    },
    motherTongue: { type: String, trim: true, default: '' },
    languagesKnown: [{ type: String }],
    height: { type: String, default: '' }, // e.g. "5ft 6in"
    weight: { type: String, default: '' }, // e.g. "65 kg"
    complexion: {
      type: String,
      enum: ['Very Fair', 'Fair', 'Wheatish', 'Wheatish Brown', 'Dark', ''],
      default: '',
    },
    bodyType: {
      type: String,
      enum: ['Slim', 'Athletic', 'Average', 'Heavy', ''],
      default: '',
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
      default: '',
    },
    physicalStatus: {
      type: String,
      enum: ['Normal', 'Physically Challenged', ''],
      default: '',
    },
    diet: {
      type: String,
      enum: ['Vegetarian', 'Non Vegetarian', 'Eggetarian', ''],
      default: '',
    },
    smoking: {
      type: String,
      enum: ['No', 'Occasionally', 'Yes', ''],
      default: '',
    },
    drinking: {
      type: String,
      enum: ['No', 'Occasionally', 'Yes', ''],
      default: '',
    },

    // ── 4. Education ──────────────────────────
    highestQualification: { type: String, trim: true, default: '' },
    degree: { type: String, trim: true, default: '' },
    specialization: { type: String, trim: true, default: '' },
    college: { type: String, trim: true, default: '' },
    graduationYear: { type: Number, default: null },

    // ── 5. Career ─────────────────────────────
    occupation: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    designation: { type: String, trim: true, default: '' },
    experience: { type: String, trim: true, default: '' }, // e.g. "5 Years"
    annualIncome: { type: String, trim: true, default: '' }, // e.g. "5-10 LPA"
    workLocation: { type: String, trim: true, default: '' },

    // ── 6. Family Details ─────────────────────
    fatherName: { type: String, trim: true, default: '' },
    fatherOccupation: { type: String, trim: true, default: '' },
    motherName: { type: String, trim: true, default: '' },
    motherOccupation: { type: String, trim: true, default: '' },
    brothers: { type: Number, default: 0, min: 0 },
    marriedBrothers: { type: Number, default: 0, min: 0 },
    sisters: { type: Number, default: 0, min: 0 },
    marriedSisters: { type: Number, default: 0, min: 0 },
    familyType: {
      type: String,
      enum: ['Nuclear', 'Joint', 'Extended', ''],
      default: '',
    },
    familyStatus: {
      type: String,
      enum: ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent', ''],
      default: '',
    },
    familyValues: {
      type: String,
      enum: ['Traditional', 'Moderate', 'Liberal', ''],
      default: '',
    },

    // ── 7. Address ────────────────────────────
    country: { type: String, trim: true, default: 'India' },
    state: { type: String, trim: true, default: '' },
    district: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    nativePlace: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },

    // ── 8. Church Information ─────────────────
    baptized: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
    firstHolyCommunion: { type: Boolean, default: false },
    activeInChurch: { type: Boolean, default: false },
    churchMinistry: { type: String, trim: true, default: '' },

    // ── 9. About Me ───────────────────────────
    aboutMe: { type: String, trim: true, default: '' },

    // ── 10. Partner Preference ────────────────
    preferredAgeFrom: { type: Number, default: null },
    preferredAgeTo: { type: Number, default: null },
    preferredHeightFrom: { type: String, default: '' },
    preferredHeightTo: { type: String, default: '' },
    preferredMaritalStatus: [{ type: String }],
    preferredEducation: [{ type: String }],
    preferredOccupation: [{ type: String }],
    preferredDenomination: [{ type: String }],
    preferredState: [{ type: String }],
    preferredDistrict: [{ type: String }],

    // ── 11. Gallery ───────────────────────────
    photos: { type: [galleryPhotoSchema], default: [] },

    // ── 12. Documents ─────────────────────────
    documents: { type: [documentSchema], default: [] },

    // ── Admin-only Fields ─────────────────────
    profileStatus: {
      type: String,
      enum: ['Pending', 'Active', 'Suspended', 'Rejected'],
      default: 'Pending',
    },
    verificationStatus: {
      type: String,
      enum: ['Unverified', 'Verified', 'Rejected'],
      default: 'Unverified',
    },
    featuredProfile: { type: Boolean, default: false },
    premiumMember: { type: Boolean, default: false },
    membershipType: {
      type: String,
      enum: ['Free', 'Silver', 'Gold', 'Platinum'],
      default: 'Free',
    },
    membershipExpiry: { type: Date, default: null },
    adminRemarks: { type: String, default: '' },
    blocked: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    profileCompletion: { type: Number, default: 0 },
    createdBy: { type: String, default: 'self' }, // 'self' | 'admin'
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedDate: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─────────────────────────────────────────────
// Virtual: age (auto-calculated)
// ─────────────────────────────────────────────
userProfileSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const dob = new Date(this.dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
});

// ─────────────────────────────────────────────
// Virtual: fullName
// ─────────────────────────────────────────────
userProfileSchema.virtual('fullName').get(function () {
  return [this.firstName, this.lastName].filter(Boolean).join(' ');
});

// ─────────────────────────────────────────────
// Static: Calculate profile completion
// ─────────────────────────────────────────────
userProfileSchema.statics.calculateCompletion = function (profile) {
  const scores = {
    basic: 0,      // 15%
    religion: 0,   // 10%
    education: 0,  // 10%
    career: 0,     // 10%
    family: 0,     // 10%
    preference: 0, // 10%
    address: 0,    // 10%
    about: 0,      // 10%
    photos: 0,     // 15%
    documents: 0,  // 10%
  };

  // Basic (15%) — 5 key fields
  const basicFields = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'mobileNumber'];
  const basicFilled = basicFields.filter((f) => profile[f] && profile[f] !== '').length;
  scores.basic = Math.round((basicFilled / basicFields.length) * 15);

  // Religion (10%) — 4 key fields
  const religionFields = ['denomination', 'diocese', 'parish', 'church'];
  const religionFilled = religionFields.filter((f) => profile[f] && profile[f] !== '').length;
  scores.religion = Math.round((religionFilled / religionFields.length) * 10);

  // Education (10%) — 3 key fields
  const eduFields = ['highestQualification', 'degree', 'college'];
  const eduFilled = eduFields.filter((f) => profile[f] && profile[f] !== '').length;
  scores.education = Math.round((eduFilled / eduFields.length) * 10);

  // Career (10%) — 3 key fields
  const careerFields = ['occupation', 'designation', 'annualIncome'];
  const careerFilled = careerFields.filter((f) => profile[f] && profile[f] !== '').length;
  scores.career = Math.round((careerFilled / careerFields.length) * 10);

  // Family (10%) — 3 key fields
  const familyFields = ['fatherName', 'motherName', 'familyType'];
  const familyFilled = familyFields.filter((f) => profile[f] && profile[f] !== '').length;
  scores.family = Math.round((familyFilled / familyFields.length) * 10);

  // Partner Preference (10%) — 2 key fields
  const prefFilled =
    (profile.preferredAgeFrom ? 1 : 0) + (profile.preferredDenomination?.length > 0 ? 1 : 0);
  scores.preference = Math.round((prefFilled / 2) * 10);

  // Address (10%) — 3 key fields
  const addressFields = ['state', 'district', 'city'];
  const addressFilled = addressFields.filter((f) => profile[f] && profile[f] !== '').length;
  scores.address = Math.round((addressFilled / addressFields.length) * 10);

  // About (10%) — 1 field
  scores.about = profile.aboutMe && profile.aboutMe.length > 20 ? 10 : 0;

  // Photos (15%) — profile photo = 10, cover = 5
  scores.photos = (profile.profileImage ? 10 : 0) + (profile.coverImage ? 5 : 0);

  // Documents (10%) — any document uploaded
  scores.documents = profile.documents && profile.documents.length > 0 ? 10 : 0;

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  return { total: Math.min(total, 100), breakdown: scores };
};

// ─────────────────────────────────────────────
// Pre-save: recalculate profileCompletion
// ─────────────────────────────────────────────
userProfileSchema.pre('save', function (next) {
  const { total } = this.constructor.calculateCompletion(this);
  this.profileCompletion = total;
  next();
});

// ─────────────────────────────────────────────
// Index
// ─────────────────────────────────────────────
userProfileSchema.index({ userId: 1 }, { unique: true });
userProfileSchema.index({ profileStatus: 1 });
userProfileSchema.index({ membershipType: 1 });

module.exports = mongoose.model('UserProfile', userProfileSchema);
