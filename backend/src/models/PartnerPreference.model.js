const mongoose = require('mongoose');

const partnerPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    ageMin: { type: Number, default: 18 },
    ageMax: { type: Number, default: 45 },
    heightMin: { type: Number }, // cm
    heightMax: { type: Number },
    maritalStatus: [{ type: String }],
    religion: [{ type: String }],
    caste: [{ type: String }],
    subCaste: [{ type: String }],
    education: [{ type: String }],
    occupation: [{ type: String }],
    annualIncomeMin: { type: Number },
    annualIncomeMax: { type: Number },
    country: [{ type: String }],
    state: [{ type: String }],
    city: [{ type: String }],
    complexion: [{ type: String }],
    motherTongue: [{ type: String }],
    languages: [{ type: String }],
    manglik: { type: String, enum: ['yes', 'no', 'any'], default: 'any' },
    diet: [{ type: String }],
    smoke: { type: String, enum: ['yes', 'no', 'any'], default: 'any' },
    drink: { type: String, enum: ['yes', 'no', 'any'], default: 'any' },
    aboutPartner: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

const PartnerPreference = mongoose.model('PartnerPreference', partnerPreferenceSchema);
module.exports = PartnerPreference;
