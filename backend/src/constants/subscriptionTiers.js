const SUBSCRIPTION_TIERS = Object.freeze({
  FREE: 'free',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
});

const SUBSCRIPTION_STATUS = Object.freeze({
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
});

/** Feature limits per tier */
const TIER_LIMITS = Object.freeze({
  [SUBSCRIPTION_TIERS.FREE]: {
    interestsPerDay: 3,
    canViewContact: false,
    canViewGallery: false,
    canChat: false,
    maxShortlist: 10,
  },
  [SUBSCRIPTION_TIERS.SILVER]: {
    interestsPerDay: 20,
    canViewContact: false,
    canViewGallery: true,
    canChat: true,
    maxShortlist: 50,
  },
  [SUBSCRIPTION_TIERS.GOLD]: {
    interestsPerDay: 50,
    canViewContact: true,
    canViewGallery: true,
    canChat: true,
    maxShortlist: 200,
  },
  [SUBSCRIPTION_TIERS.PLATINUM]: {
    interestsPerDay: -1, // Unlimited
    canViewContact: true,
    canViewGallery: true,
    canChat: true,
    maxShortlist: -1, // Unlimited
  },
});

module.exports = { SUBSCRIPTION_TIERS, SUBSCRIPTION_STATUS, TIER_LIMITS };
