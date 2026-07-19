const Joi = require('joi');
const { validate } = require('./auth.validator');
const { GENDER } = require('../constants/gender');
const { MARITAL_STATUS } = require('../constants/maritalStatus');
const { RELIGION } = require('../constants/religion');
const { EDUCATION } = require('../constants/education');
const { OCCUPATION } = require('../constants/occupation');

/**
 * Search & Discovery request validators using Joi.
 */

const searchQuerySchema = Joi.object({
  gender: Joi.string().valid(...Object.values(GENDER)).optional(),
  minAge: Joi.number().integer().min(18).max(120).optional(),
  maxAge: Joi.number().integer().min(18).max(120).optional(),
  minHeight: Joi.number().min(50).max(300).optional(),
  maxHeight: Joi.number().min(50).max(300).optional(),
  religion: Joi.string().valid(...Object.values(RELIGION)).optional(),
  caste: Joi.string().trim().max(100).optional(),
  maritalStatus: Joi.string().valid(...Object.values(MARITAL_STATUS)).optional(),
  education: Joi.string().valid(...Object.values(EDUCATION)).optional(),
  occupation: Joi.string().valid(...Object.values(OCCUPATION)).optional(),
  city: Joi.string().trim().max(100).optional(),
  state: Joi.string().trim().max(100).optional(),
  country: Joi.string().trim().max(100).optional(),
  minIncome: Joi.number().min(0).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().valid('recent', 'age_asc', 'age_desc', 'income_desc').default('recent'),
});

module.exports = {
  validate,
  searchQuerySchema,
};
