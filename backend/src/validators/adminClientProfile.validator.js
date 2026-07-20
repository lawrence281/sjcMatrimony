const Joi = require('joi');
const { REGEX } = require('../constants/regex');
const { GENDER } = require('../constants/gender');
const { MARITAL_STATUS } = require('../constants/maritalStatus');
const { RELIGION } = require('../constants/religion');
const { EDUCATION } = require('../constants/education');
const { OCCUPATION } = require('../constants/occupation');
const { BLOOD_GROUP } = require('../constants/bloodGroup');
const { validate } = require('./auth.validator');

/**
 * Admin Client Profile Validators
 * ─────────────────────────────────────────────────────────────────────────────
 * Validates requests for admin-initiated client profile creation/editing.
 * Combines User account fields (email, phone, password) with Profile fields.
 */

// ── Shared param schema ───────────────────────────────────────────────────────

const idParamSchema = Joi.object({
  id: Joi.string().pattern(REGEX.MONGO_ID).required().messages({
    'string.pattern.base': 'Invalid ID format.',
    'any.required': 'ID is required.',
  }),
});

// ── Create: User account + Profile details (unified) ─────────────────────────

const createClientProfileSchema = Joi.object({
  // ── Account credentials ──────────────────────────────────────────────────
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email address is required.',
    }),

  phone: Joi.string()
    .pattern(REGEX.PHONE_IN)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number.',
      'any.required': 'Phone number is required.',
    }),

  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(REGEX.PASSWORD)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      'any.required': 'Password is required.',
    }),

  // ── Profile — required fields ────────────────────────────────────────────
  firstName: Joi.string().trim().min(2).max(100).required().messages({
    'any.required': 'First name is required.',
  }),

  lastName: Joi.string().trim().min(1).max(100).required().messages({
    'any.required': 'Last name is required.',
  }),

  dateOfBirth: Joi.date().iso().max('now').required().messages({
    'any.required': 'Date of birth is required.',
    'date.max': 'Date of birth cannot be in the future.',
  }),

  gender: Joi.string()
    .valid(...Object.values(GENDER))
    .required()
    .messages({
      'any.only': 'Invalid gender value.',
      'any.required': 'Gender is required.',
    }),

  maritalStatus: Joi.string()
    .valid(...Object.values(MARITAL_STATUS))
    .required()
    .messages({
      'any.only': 'Invalid marital status.',
      'any.required': 'Marital status is required.',
    }),

  // ── Profile — optional fields ────────────────────────────────────────────
  height: Joi.number().min(50).max(300).optional(),
  weight: Joi.number().min(20).max(500).optional(),
  complexion: Joi.string()
    .valid('very_fair', 'fair', 'wheatish', 'dark', 'very_dark')
    .optional(),
  bodyType: Joi.string().valid('slim', 'athletic', 'average', 'heavy').optional(),
  bloodGroup: Joi.string().valid(...Object.values(BLOOD_GROUP)).optional(),
  physicalStatus: Joi.string().valid('normal', 'physically_challenged').optional(),

  religion: Joi.string().valid(...Object.values(RELIGION)).optional(),
  caste: Joi.string().trim().max(100).optional(),
  subCaste: Joi.string().trim().max(100).optional(),
  gotra: Joi.string().trim().max(100).optional(),
  manglik: Joi.string().valid('yes', 'no', 'partial', 'dont_know').optional(),
  motherTongue: Joi.string().trim().max(100).optional(),
  languages: Joi.array().items(Joi.string().trim()).optional(),

  havingChildren: Joi.boolean().optional(),
  numberOfChildren: Joi.number().min(0).optional(),
  aboutMe: Joi.string().trim().max(1000).optional(),
  hobbies: Joi.array().items(Joi.string().trim()).optional(),

  nationality: Joi.string().trim().max(100).optional(),
  country: Joi.string().trim().max(100).optional(),
  state: Joi.string().trim().max(100).optional(),
  city: Joi.string().trim().max(100).optional(),
  residencyStatus: Joi.string()
    .valid('citizen', 'permanent_resident', 'student_visa', 'work_permit', 'other')
    .optional(),

  education: Joi.string().valid(...Object.values(EDUCATION)).optional(),
  educationDetails: Joi.string().trim().max(500).optional(),
  institution: Joi.string().trim().max(200).optional(),
  occupation: Joi.string().valid(...Object.values(OCCUPATION)).optional(),
  occupationDetails: Joi.string().trim().max(500).optional(),
  employer: Joi.string().trim().max(200).optional(),
  annualIncome: Joi.number().min(0).optional(),
  workLocation: Joi.string().trim().max(200).optional(),

  fatherName: Joi.string().trim().max(100).optional(),
  fatherOccupation: Joi.string().trim().max(100).optional(),
  motherName: Joi.string().trim().max(100).optional(),
  motherOccupation: Joi.string().trim().max(100).optional(),
  numberOfBrothers: Joi.number().min(0).optional(),
  numberOfSisters: Joi.number().min(0).optional(),
  familyType: Joi.string().valid('joint', 'nuclear', 'extended').optional(),
  familyStatus: Joi.string()
    .valid('middle_class', 'upper_middle_class', 'rich', 'affluent')
    .optional(),
  familyValues: Joi.string().valid('traditional', 'moderate', 'liberal').optional(),
  familyLocation: Joi.string().trim().max(200).optional(),

  diet: Joi.string()
    .valid('vegetarian', 'non_vegetarian', 'eggetarian', 'vegan', 'jain')
    .optional(),
  smoke: Joi.string().valid('yes', 'no', 'occasionally').optional(),
  drink: Joi.string().valid('yes', 'no', 'occasionally').optional(),

  // ── Admin note ───────────────────────────────────────────────────────────
  adminNotes: Joi.string().trim().max(500).optional(),
});

// ── Update: all fields optional ───────────────────────────────────────────────

const updateClientProfileSchema = Joi.object({
  // Account fields (optional on update)
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .optional()
    .messages({ 'string.email': 'Please provide a valid email address.' }),

  phone: Joi.string()
    .pattern(REGEX.PHONE_IN)
    .optional()
    .messages({ 'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number.' }),

  // Profile fields
  firstName: Joi.string().trim().min(2).max(100).optional(),
  lastName: Joi.string().trim().min(1).max(100).optional(),
  dateOfBirth: Joi.date().iso().max('now').optional(),
  gender: Joi.string().valid(...Object.values(GENDER)).optional(),
  maritalStatus: Joi.string().valid(...Object.values(MARITAL_STATUS)).optional(),
  height: Joi.number().min(50).max(300).optional(),
  weight: Joi.number().min(20).max(500).optional(),
  complexion: Joi.string()
    .valid('very_fair', 'fair', 'wheatish', 'dark', 'very_dark')
    .optional(),
  bodyType: Joi.string().valid('slim', 'athletic', 'average', 'heavy').optional(),
  bloodGroup: Joi.string().valid(...Object.values(BLOOD_GROUP)).optional(),
  physicalStatus: Joi.string().valid('normal', 'physically_challenged').optional(),
  religion: Joi.string().valid(...Object.values(RELIGION)).optional(),
  caste: Joi.string().trim().max(100).optional(),
  subCaste: Joi.string().trim().max(100).optional(),
  gotra: Joi.string().trim().max(100).optional(),
  manglik: Joi.string().valid('yes', 'no', 'partial', 'dont_know').optional(),
  motherTongue: Joi.string().trim().max(100).optional(),
  languages: Joi.array().items(Joi.string().trim()).optional(),
  havingChildren: Joi.boolean().optional(),
  numberOfChildren: Joi.number().min(0).optional(),
  aboutMe: Joi.string().trim().max(1000).optional(),
  hobbies: Joi.array().items(Joi.string().trim()).optional(),
  nationality: Joi.string().trim().max(100).optional(),
  country: Joi.string().trim().max(100).optional(),
  state: Joi.string().trim().max(100).optional(),
  city: Joi.string().trim().max(100).optional(),
  residencyStatus: Joi.string()
    .valid('citizen', 'permanent_resident', 'student_visa', 'work_permit', 'other')
    .optional(),
  education: Joi.string().valid(...Object.values(EDUCATION)).optional(),
  educationDetails: Joi.string().trim().max(500).optional(),
  institution: Joi.string().trim().max(200).optional(),
  occupation: Joi.string().valid(...Object.values(OCCUPATION)).optional(),
  occupationDetails: Joi.string().trim().max(500).optional(),
  employer: Joi.string().trim().max(200).optional(),
  annualIncome: Joi.number().min(0).optional(),
  workLocation: Joi.string().trim().max(200).optional(),
  fatherName: Joi.string().trim().max(100).optional(),
  fatherOccupation: Joi.string().trim().max(100).optional(),
  motherName: Joi.string().trim().max(100).optional(),
  motherOccupation: Joi.string().trim().max(100).optional(),
  numberOfBrothers: Joi.number().min(0).optional(),
  numberOfSisters: Joi.number().min(0).optional(),
  familyType: Joi.string().valid('joint', 'nuclear', 'extended').optional(),
  familyStatus: Joi.string()
    .valid('middle_class', 'upper_middle_class', 'rich', 'affluent')
    .optional(),
  familyValues: Joi.string().valid('traditional', 'moderate', 'liberal').optional(),
  familyLocation: Joi.string().trim().max(200).optional(),
  diet: Joi.string()
    .valid('vegetarian', 'non_vegetarian', 'eggetarian', 'vegan', 'jain')
    .optional(),
  smoke: Joi.string().valid('yes', 'no', 'occasionally').optional(),
  drink: Joi.string().valid('yes', 'no', 'occasionally').optional(),
  adminNotes: Joi.string().trim().max(500).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

// ── List query schema ─────────────────────────────────────────────────────────

const listClientProfilesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string()
    .valid('pending', 'approved', 'active', 'suspended', 'banned', 'incomplete', 'deleted')
    .optional(),
  gender: Joi.string().valid(...Object.values(GENDER)).optional(),
  search: Joi.string().trim().allow('').optional(),
  sort: Joi.string().trim().default('-createdAt'),
});

module.exports = {
  validate,
  idParamSchema,
  createClientProfileSchema,
  updateClientProfileSchema,
  listClientProfilesSchema,
};
