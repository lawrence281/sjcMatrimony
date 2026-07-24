require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_ecommerce';

const categories = [
  { name: 'DK Ignite Shells', slug: 'aerial-shells', description: 'Professional grade aerial effects', featured: true },
  { name: 'Roman Candles', slug: 'roman-candles', description: 'Multi-shot projectile tubes', featured: true },
  { name: 'Sparklers', slug: 'sparklers', description: 'Handheld celebratory sparklers', featured: true },
  { name: 'Ground Spinners', slug: 'ground-spinners', description: 'Ground-based light shows', featured: true },
  { name: 'Color Smoke', slug: 'color-smoke', description: 'Vibrant daytime smoke effects', featured: false },
  { name: 'Family Assortments', slug: 'assortments', description: 'Curated sets for all ages', featured: false },
];

const generateProducts = (cats) => {
  const catMap = {};
  cats.forEach(c => { catMap[c.slug] = c._id; });
  return [
    { name: 'Midnight Thunder 12"', description: 'Massive golden willow effect with deep booming thunder crackle.', price: 129.00, originalPrice: 159.00, category: catMap['aerial-shells'], images: [], colors: ['#FFD700', '#FFFFFF'], badge: 'BEST SELLER', stock: 25, salesCount: 540, averageRating: 4.9, totalReviews: 86, featured: true },
    { name: 'Neon Dragon 8-Shot', description: 'High-intensity color-changing candle with crackling dragon tail effect.', price: 24.50, originalPrice: 32.00, category: catMap['roman-candles'], images: [], colors: ['#00FF00', '#FF00FF'], badge: 'SAVE', stock: 120, salesCount: 890, averageRating: 4.7, totalReviews: 142 },
    { name: 'Golden Glitzy Sparklers', description: 'Extra long-lasting bamboo sparklers with safe cool-burning technology.', price: 8.99, originalPrice: 0, category: catMap['sparklers'], images: [], colors: ['#FFD700'], badge: 'TRENDING', stock: 450, salesCount: 2300, averageRating: 4.8, totalReviews: 210 },
    { name: 'Dancing Dervish', description: 'Rapidly spinning ground firework that changes from red to green to whistling white.', price: 15.00, originalPrice: 0, category: catMap['ground-spinners'], images: [], colors: ['#FF0000', '#00FF00', '#FFFFFF'], badge: 'NEW ARRIVAL', stock: 85, salesCount: 310, averageRating: 4.6, totalReviews: 54 },
    { name: 'Sky Paint 50-Shot Cake', description: 'A complete aerial display in a box. 50 shots of mixed patterns and whistles.', price: 89.00, originalPrice: 110.00, category: catMap['aerial-shells'], images: [], colors: ['#FF0000', '#0000FF', '#FFFF00'], badge: 'LIMITED EDITION', stock: 15, salesCount: 205, averageRating: 5.0, totalReviews: 92, featured: true },
    { name: 'Crimson Fog', description: 'High-volume daytime red smoke emitter. Lasts full 90 seconds.', price: 12.00, originalPrice: 0, category: catMap['color-smoke'], images: [], colors: ['#FF0000'], badge: '', stock: 200, salesCount: 430, averageRating: 4.5, totalReviews: 68 },
    { name: 'Premium Family Combo', description: 'A massive combination of sparklers, shells, and spinners for the whole family.', price: 199.99, originalPrice: 249.99, category: catMap['assortments'], images: [], badge: 'SAVE 20%', stock: 50, salesCount: 150, averageRating: 4.9, totalReviews: 45, featured: true, isCombo: true },
    { name: 'Ultimate Shell Pack', description: 'A pack of 36 high-performance aerial shells with professional effects.', price: 299.00, originalPrice: 350.00, category: catMap['aerial-shells'], images: [], badge: 'VALUE PACK', stock: 20, salesCount: 88, averageRating: 5.0, totalReviews: 32, isCombo: true },
  ];
};

const cities = [
  { city: 'New York', state: 'NY', country: 'US', lat: 40.7128, lng: -74.0060 },
  { city: 'Los Angeles', state: 'CA', country: 'US', lat: 34.0522, lng: -118.2437 },
  { city: 'Chicago', state: 'IL', country: 'US', lat: 41.8781, lng: -87.6298 },
  { city: 'Houston', state: 'TX', country: 'US', lat: 29.7604, lng: -95.3698 },
  { city: 'Miami', state: 'FL', country: 'US', lat: 25.7617, lng: -80.1918 },
  { city: 'Seattle', state: 'WA', country: 'US', lat: 47.6062, lng: -122.3321 },
  { city: 'Boston', state: 'MA', country: 'US', lat: 42.3601, lng: -71.0589 },
  { city: 'Denver', state: 'CO', country: 'US', lat: 39.7392, lng: -104.9903 },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create categories
    const createdCats = await Category.insertMany(categories);
    console.log(`📂 Created ${createdCats.length} categories`);

    // Create products
    const productData = generateProducts(createdCats);
    const createdProducts = await Product.insertMany(productData);
    console.log(`📦 Created ${createdProducts.length} products`);

    // Create admin user
    const admin = await User.create({
      name: 'DK Ignite Admin', email: 'cracker@dkingite.com', password: 'admin123',
      role: 'admin', location: { city: 'New York', state: 'NY', country: 'US' },
    });

    // Create regular users
    const usersData = [
      { name: 'Alexander Chen', email: 'alex@example.com', loc: cities[0] },
      { name: 'Sofia Martinez', email: 'sofia@example.com', loc: cities[1] },
      { name: 'James Wilson', email: 'james@example.com', loc: cities[2] },
      { name: 'Emma Thompson', email: 'emma@example.com', loc: cities[3] },
      { name: 'Lucas Brown', email: 'lucas@example.com', loc: cities[4] },
      { name: 'Olivia Davis', email: 'olivia@example.com', loc: cities[5] },
      { name: 'Noah Johnson', email: 'noah@example.com', loc: cities[6] },
      { name: 'Ava Williams', email: 'ava@example.com', loc: cities[7] },
    ];

    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create({
        name: u.name, email: u.email, password: 'user123', role: 'user',
        location: { city: u.loc.city, state: u.loc.state, country: u.loc.country, coordinates: { lat: u.loc.lat, lng: u.loc.lng } },
      });
      createdUsers.push({ user, loc: u.loc });
    }
    console.log(`👥 Created ${createdUsers.length} users + 1 admin`);

    // Create orders spanning last 6 months
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'delivered', 'delivered'];
    const orderCount = 40;
    for (let i = 0; i < orderCount; i++) {
      const userEntry = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const numItems = Math.floor(Math.random() * 3) + 1;
      const items = [];
      let subtotal = 0;
      for (let j = 0; j < numItems; j++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        items.push({ product: product._id, name: product.name, image: '', price: product.price, quantity: qty });
        subtotal += product.price * qty;
      }
      const tax = Math.round(subtotal * 0.08 * 100) / 100;
      const total = subtotal + tax;
      const daysAgo = Math.floor(Math.random() * 180);
      const createdAt = new Date(Date.now() - daysAgo * 86400000);

      await Order.create({
        user: userEntry.user._id,
        items,
        shippingAddress: {
          fullName: userEntry.user.name,
          streetAddress: `${Math.floor(Math.random() * 999) + 1} Main St`,
          city: userEntry.loc.city, state: userEntry.loc.state, zip: '10001', country: userEntry.loc.country,
        },
        paymentMethod: ['credit_card', 'paypal', 'apple_pay'][Math.floor(Math.random() * 3)],
        subtotal, tax, shipping: 0, total,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt,
      });
    }
    console.log(`🛒 Created ${orderCount} orders`);

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:');
    console.log('  Email:    cracker@dkingite.com');
    console.log('  Password: admin123');
    console.log('\nUser Login (any user):');
    console.log('  Email:    alex@example.com');
    console.log('  Password: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
