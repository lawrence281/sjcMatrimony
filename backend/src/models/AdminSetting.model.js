const mongoose = require('mongoose');

const adminSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: String },
    isPublic: { type: Boolean, default: false }, // If true, exposed to client portal
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const AdminSetting = mongoose.model('AdminSetting', adminSettingSchema);
module.exports = AdminSetting;
