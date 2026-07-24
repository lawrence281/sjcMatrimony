const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, default: '' },
  date: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }],
  stock: { type: Number, default: 0, min: 0 },
  safetyInformation: { type: String, default: '' },
  type: { type: String, required: true, default: 'Sparklers' }, // e.g., Sparklers, Rockets, Bombs
  noiseLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  availabilityStatus: { type: String, enum: ['In Stock', 'Out of Stock', 'Coming Soon'], default: 'In Stock' },
  salesCount: { type: Number, default: 0 },
  ratings: [ratingSchema],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  isCombo: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

productSchema.virtual('isOutOfStock').get(function() {
  return this.stock <= 0;
});

productSchema.pre('save', function(next) {
  if (this.stock <= 0) {
    if (this.availabilityStatus !== 'Coming Soon') {
      this.availabilityStatus = 'Out of Stock';
    }
  } else if (this.availabilityStatus === 'Out of Stock') {
    this.availabilityStatus = 'In Stock';
  }
  next();
});

productSchema.methods.updateRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
  } else {
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
    this.totalReviews = this.ratings.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
