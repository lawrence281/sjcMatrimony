const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../../config/database');
const User = require('../../models/User.model');
const { Plan } = require('../../models/Subscription.model');
const AdminSetting = require('../../models/AdminSetting.model');
const { ROLES } = require('../../constants/roles');
const { SUBSCRIPTION_TIERS } = require('../../constants/subscriptionTiers');
const logger = require('../../utils/logger');

const seed = async () => {
  await connectDB();

  // ── Super Admin ────────────────────────────────────────
  const existingAdmin = await User.findOne({ role: ROLES.SUPER_ADMIN });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123456', 12);
    await User.create({
      email: 'superadmin@matrimony.com',
      phone: '9000000000',
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
    });
    logger.info('✅ Super Admin created: superadmin@matrimony.com / Admin@123456');
  } else {
    logger.info('ℹ️  Super Admin already exists. Skipping.');
  }

  // ── Test Client User ────────────────────────────────────
  const existingClient = await User.findOne({ email: 'client@matrimony.com' });
  if (!existingClient) {
    const passwordHash = await bcrypt.hash('Client@123456', 12);
    await User.create({
      email: 'client@matrimony.com',
      phone: '8000000000',
      passwordHash,
      role: ROLES.CLIENT,
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
    });
    logger.info('✅ Test Client created: client@matrimony.com / Client@123456');
  } else {
    logger.info('ℹ️  Test Client already exists. Skipping.');
  }

  // ── Subscription Plans ────────────────────────────────
  const plans = [
    {
      name: 'Free',
      tier: SUBSCRIPTION_TIERS.FREE,
      price: 0,
      durationDays: 30,
      displayOrder: 1,
      description: 'Basic access to explore profiles',
      features: { interestsPerDay: 3, canViewContact: false, canViewGallery: false, canChat: false, maxShortlist: 10 },
    },
    {
      name: 'Silver',
      tier: SUBSCRIPTION_TIERS.SILVER,
      price: 999,
      durationDays: 90,
      displayOrder: 2,
      description: 'Enhanced features for serious seekers',
      features: { interestsPerDay: 20, canViewContact: false, canViewGallery: true, canChat: true, maxShortlist: 50 },
    },
    {
      name: 'Gold',
      tier: SUBSCRIPTION_TIERS.GOLD,
      price: 1999,
      durationDays: 180,
      displayOrder: 3,
      description: 'Full access with contact visibility',
      features: { interestsPerDay: 50, canViewContact: true, canViewGallery: true, canChat: true, maxShortlist: 200, profileBoost: true },
    },
    {
      name: 'Platinum',
      tier: SUBSCRIPTION_TIERS.PLATINUM,
      price: 3999,
      durationDays: 365,
      displayOrder: 4,
      description: 'Premium with dedicated relationship manager',
      features: { interestsPerDay: -1, canViewContact: true, canViewGallery: true, canChat: true, maxShortlist: -1, profileBoost: true, dedicatedRM: true },
    },
  ];

  for (const plan of plans) {
    await Plan.findOneAndUpdate({ tier: plan.tier }, plan, { upsert: true, new: true });
  }
  logger.info('✅ Subscription plans seeded.');

  // ── Admin Settings ────────────────────────────────────
  const settings = [
    { key: 'site_name', value: 'Matrimony Platform', description: 'Platform name', isPublic: true },
    { key: 'maintenance_mode', value: false, description: 'Enable/disable maintenance mode', isPublic: true },
    { key: 'max_gallery_images', value: 10, description: 'Max gallery images per profile', isPublic: false },
    { key: 'profile_auto_approve', value: false, description: 'Auto-approve profiles without admin review', isPublic: false },
    { key: 'support_email', value: 'support@matrimony.com', description: 'Support email address', isPublic: true },
    { key: 'support_phone', value: '+91-9000000000', description: 'Support phone number', isPublic: true },
  ];

  for (const setting of settings) {
    await AdminSetting.findOneAndUpdate({ key: setting.key }, setting, { upsert: true, new: true });
  }
  logger.info('✅ Admin settings seeded.');

  logger.info('🎉 Database seeding completed successfully.');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  logger.error(`Seeding failed: ${err.message}`);
  process.exit(1);
});
