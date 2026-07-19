const Joi = require('joi');
const { validate } = require('./auth.validator');
const { GENDER } = require('../constants/gender');
const { MARITAL_STATUS } = require('../constants/maritalStatus');
const { RELIGION } = require('../constants/religion');
const { EDUCATION } = require('../constants/education');
const { OCCUPATION } = require('../constants/occupation');
const { BLOOD_GROUP } = require('../constants/bloodGroup');

/**
 * Profile request validators using Joi.
 */

const createProfileSchema = Joi.object({
  firstName: Joi.string().trim().max(100).required().messages({
    'any.required': 'First name is required.',
  }),
  lastName: Joi.string().trim().max(100).required().messages({
    'any.required': 'Last name is required.',
  }),
  dateOfBirth: Joi.date().iso().max('now').required().messages({
    'any.required': 'Date of birth is required.',
  }),
  gender: Joi.string()
    .valid(...Object.values(GENDER))
    .required()
    .messages({
      'any.only': 'Invalid gender field.',
      'any.required': 'Gender is required.',
    }),
  maritalStatus: Joi.string()
    .valid(...Object.values(MARITAL_STATUS))
    .required()
    .messages({
      'any.only': 'Invalid marital status.',
      'any.required': 'Marital status is required.',
    }),
  height: Joi.number().min(50).max(300).optional(),
  weight: Joi.number().min(20).max(500).optional(),
  complexion: Joi.string().valid('very_fair', 'fair', 'wheatish', 'dark', 'very_dark').optional(),
  bodyType: Joi.string().valid('slim', 'athletic', 'average', 'heavy').optional(),
  bloodGroup: Joi.string().valid(...Object.values(BLOOD_GROUP)).optional(),
  religion: Joi.string().valid(...Object.values(RELIGION)).optional(),
  caste: Joi.string().trim().max(100).optional(),
  subCaste: Joi.string().trim().max(100).optional(),
  gotra: Joi.string().trim().max(100).optional(),
  manglik: Joi.string().valid('yes', 'no', 'partial', 'dont_know').optional(),
  motherTongue: Joi.string().trim().max(100).optional(),
  languages: Joi.array().items(Joi.string().trim()).optional(),
  aboutMe: Joi.string().trim().max(1000).optional(),
  annualIncome: Joi.number().min(0).optional(),
  education: Joi.string().valid(...Object.values(EDUCATION)).optional(),
  occupation: Joi.string().valid(...Object.values(OCCUPATION)).optional(),
  city: Joi.string().trim().max(100).optional(),
  state: Joi.string().trim().max(100).optional(),
  country: Joi.string().trim().max(100).optional(),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().max(100).optional(),
  lastName: Joi.string().trim().max(100).optional(),
  dateOfBirth: Joi.date().iso().max('now').optional(),
  gender: Joi.string().valid(...Object.values(GENDER)).optional(),
  maritalStatus: Joi.string().valid(...Object.values(MARITAL_STATUS)).optional(),
  height: Joi.number().min(50).max(300).optional(),
  weight: Joi.number().min(20).max(500).optional(),
  complexion: Joi.string().valid('very_fair', 'fair', 'wheatish', 'dark', 'very_dark').optional(),
  bodyType: Joi.string().valid('slim', 'athletic', 'average', 'heavy').optional(),
  bloodGroup: Joi.string().valid(...Object.values(BLOOD_GROUP)).optional(),
  religion: Joi.string().valid(...Object.values(RELIGION)).optional(),
  caste: Joi.string().trim().max(100).optional(),
  subCaste: Joi.string().trim().max(100).optional(),
  gotra: Joi.string().trim().max(100).optional(),
  manglik: Joi.string().valid('yes', 'no', 'partial', 'dont_know').optional(),
  motherTongue: Joi.string().trim().max(100).optional(),
  languages: Joi.array().items(Joi.string().trim()).optional(),
  aboutMe: Joi.string().trim().max(1000).optional(),
  annualIncome: Joi.number().min(0).optional(),
  education: Joi.string().valid(...Object.values(EDUCATION)).optional(),
  occupation: Joi.string().valid(...Object.values(OCCUPATION)).optional(),
  city: Joi.string().trim().max(100).optional(),
  state: Joi.string().trim().max(100).optional(),
  country: Joi.string().trim().max(100).optional(),
}).min(1);

module.exports = {
  validate,
  createProfileSchema,
  updateProfileSchema,
};
