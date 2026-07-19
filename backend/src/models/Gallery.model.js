const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true }, // For deletion
    isPrimary: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    caption: { type: String, maxlength: 200, default: null },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

gallerySchema.index({ profileId: 1, isPrimary: 1 });

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
