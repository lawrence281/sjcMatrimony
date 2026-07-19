export const SUBSCRIPTION_TIERS = Object.freeze({
  FREE:     'free',
  SILVER:   'silver',
  GOLD:     'gold',
  PLATINUM: 'platinum',
});

export const TIER_COLORS = Object.freeze({
  [SUBSCRIPTION_TIERS.FREE]:     'bg-neutral-100 text-neutral-700',
  [SUBSCRIPTION_TIERS.SILVER]:   'bg-neutral-200 text-neutral-800',
  [SUBSCRIPTION_TIERS.GOLD]:     'bg-yellow-100 text-yellow-800',
  [SUBSCRIPTION_TIERS.PLATINUM]: 'bg-purple-100 text-purple-800',
});

export const TIER_ICONS = Object.freeze({
  [SUBSCRIPTION_TIERS.FREE]:     '🆓',
  [SUBSCRIPTION_TIERS.SILVER]:   '🥈',
  [SUBSCRIPTION_TIERS.GOLD]:     '🥇',
  [SUBSCRIPTION_TIERS.PLATINUM]: '💎',
});
