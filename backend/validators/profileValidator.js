const { body, param } = require('express-validator');

// ─────────────────────────────────────────────
// Reusable rule sets per profile section
// ─────────────────────────────────────────────

const VALID_SECTIONS = [
  'basic', 'religious', 'personal', 'education',
  'career', 'family', 'address', 'church', 'about', 'preference',
];

/**
 * Validate that the :section param is a valid profile section.
 */
const sectionParam = [
  param('section')
    .isIn(VALID_SECTIONS)
    .withMessage(`Section must be one of: ${VALID_SECTIONS.join(', ')}`),
];

/**
 * Basic Information section
 */
const basicRules = [
  body('firstName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('First name must be 2–60 characters'),

  body('lastName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Last name must be 2–60 characters'),

  body('gender')
    .optional()
    .isIn(['Male', 'Female', ''])
    .withMessage('Gender must be Male or Female'),

  body('dateOfBirth')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Date of birth must be a valid date (YYYY-MM-DD)')
    .custom((val) => {
      if (!val) return true;
      const dob = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      if (age < 18) throw new Error('Minimum age is 18 years');
      if (age > 70) throw new Error('Age cannot exceed 70 years');
      return true;
    }),

  body('mobileNumber')
    .optional()
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage('Mobile number must be 7–15 digits'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('profileFor')
    .optional()
    .isIn(['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend'])
    .withMessage('Invalid profileFor value'),
];

/**
 * Religious Information section
 */
const religiousRules = [
  body('denomination')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Denomination must be under 100 characters'),

  body('diocese')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Diocese must be under 100 characters'),

  body('parish')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Parish must be under 100 characters'),

  body('church')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Church must be under 100 characters'),

  body('baptismName')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 80 })
    .withMessage('Baptism name must be under 80 characters'),

  body('confirmationName')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 80 })
    .withMessage('Confirmation name must be under 80 characters'),
];

/**
 * Personal Information section
 */
const personalRules = [
  body('maritalStatus')
    .optional()
    .isIn(['Never Married', 'Divorced', 'Widowed', 'Separated', ''])
    .withMessage('Invalid marital status'),

  body('motherTongue')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Mother tongue too long'),

  body('languagesKnown')
    .optional()
    .isArray()
    .withMessage('Languages known must be an array'),

  body('height')
    .optional()
    .isString()
    .trim()
    .withMessage('Height must be a string'),

  body('weight')
    .optional()
    .isString()
    .trim()
    .withMessage('Weight must be a string'),

  body('complexion')
    .optional()
    .isIn(['Very Fair', 'Fair', 'Wheatish', 'Wheatish Brown', 'Dark', ''])
    .withMessage('Invalid complexion value'),

  body('bodyType')
    .optional()
    .isIn(['Slim', 'Athletic', 'Average', 'Heavy', ''])
    .withMessage('Invalid body type'),

  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''])
    .withMessage('Invalid blood group'),

  body('physicalStatus')
    .optional()
    .isIn(['Normal', 'Physically Challenged', ''])
    .withMessage('Invalid physical status'),

  body('diet')
    .optional()
    .isIn(['Vegetarian', 'Non Vegetarian', 'Eggetarian', ''])
    .withMessage('Invalid diet value'),

  body('smoking')
    .optional()
    .isIn(['No', 'Occasionally', 'Yes', ''])
    .withMessage('Invalid smoking value'),

  body('drinking')
    .optional()
    .isIn(['No', 'Occasionally', 'Yes', ''])
    .withMessage('Invalid drinking value'),
];

/**
 * Education section
 */
const educationRules = [
  body('highestQualification')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Qualification too long'),

  body('degree')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Degree too long'),

  body('specialization')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Specialization too long'),

  body('college')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 150 })
    .withMessage('College name too long'),

  body('graduationYear')
    .optional({ nullable: true })
    .isInt({ min: 1970, max: new Date().getFullYear() })
    .withMessage(`Graduation year must be between 1970 and ${new Date().getFullYear()}`),
];

/**
 * Career section
 */
const careerRules = [
  body('occupation').optional().isString().trim().isLength({ max: 100 }).withMessage('Occupation too long'),
  body('company').optional().isString().trim().isLength({ max: 150 }).withMessage('Company too long'),
  body('designation').optional().isString().trim().isLength({ max: 100 }).withMessage('Designation too long'),
  body('experience').optional().isString().trim().isLength({ max: 50 }).withMessage('Experience too long'),
  body('annualIncome').optional().isString().trim().isLength({ max: 50 }).withMessage('Annual income too long'),
  body('workLocation').optional().isString().trim().isLength({ max: 100 }).withMessage('Work location too long'),
];

/**
 * Family Details section
 */
const familyRules = [
  body('fatherName').optional().isString().trim().isLength({ max: 100 }).withMessage('Father name too long'),
  body('fatherOccupation').optional().isString().trim().isLength({ max: 100 }).withMessage('Father occupation too long'),
  body('motherName').optional().isString().trim().isLength({ max: 100 }).withMessage('Mother name too long'),
  body('motherOccupation').optional().isString().trim().isLength({ max: 100 }).withMessage('Mother occupation too long'),
  body('brothers').optional().isInt({ min: 0, max: 20 }).withMessage('Brothers count must be 0–20'),
  body('marriedBrothers').optional().isInt({ min: 0, max: 20 }).withMessage('Married brothers must be 0–20'),
  body('sisters').optional().isInt({ min: 0, max: 20 }).withMessage('Sisters count must be 0–20'),
  body('marriedSisters').optional().isInt({ min: 0, max: 20 }).withMessage('Married sisters must be 0–20'),
  body('familyType').optional().isIn(['Nuclear', 'Joint', 'Extended', '']).withMessage('Invalid family type'),
  body('familyStatus').optional().isIn(['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent', '']).withMessage('Invalid family status'),
  body('familyValues').optional().isIn(['Traditional', 'Moderate', 'Liberal', '']).withMessage('Invalid family values'),
];

/**
 * Address section
 */
const addressRules = [
  body('country').optional().isString().trim().isLength({ max: 80 }).withMessage('Country too long'),
  body('state').optional().isString().trim().isLength({ max: 80 }).withMessage('State too long'),
  body('district').optional().isString().trim().isLength({ max: 80 }).withMessage('District too long'),
  body('city').optional().isString().trim().isLength({ max: 80 }).withMessage('City too long'),
  body('nativePlace').optional().isString().trim().isLength({ max: 100 }).withMessage('Native place too long'),
  body('address').optional().isString().trim().isLength({ max: 300 }).withMessage('Address too long'),
  body('pincode').optional().matches(/^[0-9]{4,10}$/).withMessage('Pincode must be 4–10 digits'),
];

/**
 * Church Information section
 */
const churchRules = [
  body('baptized').optional().isBoolean().withMessage('Baptized must be boolean'),
  body('confirmed').optional().isBoolean().withMessage('Confirmed must be boolean'),
  body('firstHolyCommunion').optional().isBoolean().withMessage('First Holy Communion must be boolean'),
  body('activeInChurch').optional().isBoolean().withMessage('Active in church must be boolean'),
  body('churchMinistry').optional().isString().trim().isLength({ max: 200 }).withMessage('Church ministry too long'),
];

/**
 * About Me section
 */
const aboutRules = [
  body('aboutMe')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('About me must be under 2000 characters'),
];

/**
 * Partner Preference section
 */
const preferenceRules = [
  body('preferredAgeFrom').optional({ nullable: true }).isInt({ min: 18, max: 70 }).withMessage('Preferred age from must be 18–70'),
  body('preferredAgeTo').optional({ nullable: true }).isInt({ min: 18, max: 70 }).withMessage('Preferred age to must be 18–70'),
  body('preferredHeightFrom').optional().isString().trim().isLength({ max: 20 }),
  body('preferredHeightTo').optional().isString().trim().isLength({ max: 20 }),
  body('preferredMaritalStatus').optional().isArray().withMessage('Must be an array'),
  body('preferredEducation').optional().isArray().withMessage('Must be an array'),
  body('preferredOccupation').optional().isArray().withMessage('Must be an array'),
  body('preferredDenomination').optional().isArray().withMessage('Must be an array'),
  body('preferredState').optional().isArray().withMessage('Must be an array'),
  body('preferredDistrict').optional().isArray().withMessage('Must be an array'),
];

/**
 * Map section names to their validation rule arrays
 */
const SECTION_RULES = {
  basic: basicRules,
  religious: religiousRules,
  personal: personalRules,
  education: educationRules,
  career: careerRules,
  family: familyRules,
  address: addressRules,
  church: churchRules,
  about: aboutRules,
  preference: preferenceRules,
};

module.exports = {
  sectionParam,
  basicRules,
  religiousRules,
  personalRules,
  educationRules,
  careerRules,
  familyRules,
  addressRules,
  churchRules,
  aboutRules,
  preferenceRules,
  SECTION_RULES,
};
