require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sjc_matrimony';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create admin user
    await User.create({
      name: 'SJC Admin',
      email: 'admin@sjcmatrimony.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create sample regular users
    const usersData = [
      { name: 'John Paul', email: 'john@example.com' },
      { name: 'Mary Grace', email: 'mary@example.com' },
      { name: 'Thomas Joseph', email: 'thomas@example.com' },
      { name: 'Angela Rose', email: 'angela@example.com' },
      { name: 'Peter Francis', email: 'peter@example.com' },
    ];

    for (const u of usersData) {
      await User.create({
        name: u.name,
        email: u.email,
        password: 'user123',
        role: 'user',
      });
    }
    console.log(`👥 Created ${usersData.length} users + 1 admin`);

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:');
    console.log('  Email:    admin@sjcmatrimony.com');
    console.log('  Password: admin123');
    console.log('\nUser Login (any user):');
    console.log('  Email:    john@example.com');
    console.log('  Password: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
