const mongoose = require('mongoose');

const witnessSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    mobileNumber: { type: String, trim: true, default: '' },
    relation: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    docType: { type: String, trim: true, default: 'Marriage Certificate' },
    fileUrl: { type: String, required: true },
    fileName: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const marriageRegisterSchema = new mongoose.Schema(
  {
    // Bride Details
    brideName: {
      type: String,
      required: [true, 'Bride name is required'],
      trim: true,
    },
    brideProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
      default: null,
    },
    brideDob: {
      type: Date,
      default: null,
    },
    brideMobileNumber: {
      type: String,
      trim: true,
      default: '',
    },

    // Groom Details
    groomName: {
      type: String,
      required: [true, 'Groom name is required'],
      trim: true,
    },
    groomProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
      default: null,
    },
    groomDob: {
      type: Date,
      default: null,
    },
    groomMobileNumber: {
      type: String,
      trim: true,
      default: '',
    },

    // Marriage Details
    marriageDate: {
      type: Date,
      required: [true, 'Marriage date is required'],
    },
    churchName: {
      type: String,
      required: [true, 'Church name is required'],
      trim: true,
    },
    churchAddress: {
      type: String,
      trim: true,
      default: '',
    },
    diocese: {
      type: String,
      trim: true,
      default: '',
    },
    parish: {
      type: String,
      trim: true,
      default: '',
    },
    priestName: {
      type: String,
      trim: true,
      default: '',
    },
    marriageCertificateNumber: {
      type: String,
      trim: true,
      sparse: true,
      default: null,
    },
    marriageStatus: {
      type: String,
      enum: ['registered', 'pending', 'verified', 'cancelled'],
      default: 'registered',
    },

    // Additional Info
    witnesses: [witnessSchema],
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    documents: [documentSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

marriageRegisterSchema.index({ brideName: 'text', groomName: 'text', churchName: 'text', marriageCertificateNumber: 'text' });
marriageRegisterSchema.index({ marriageDate: -1 });
marriageRegisterSchema.index({ marriageStatus: 1 });

module.exports = mongoose.model('MarriageRegister', marriageRegisterSchema);
