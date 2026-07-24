import DefaultFireworkImg from '../assets/Colorful firework default image.png';

export const APP_NAME = 'DK Ignite';
export const DEFAULT_FIREWORK_IMG = DefaultFireworkImg;
export const BRAND_TAGLINE = 'Premium Pyrotechnics & Display Services';
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_LOCALE = 'en-IN';

export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Welcome back to DK Ignite!',
    REGISTER_SUCCESS: 'Account created! Safe celebrations ahead.',
    LOGOUT: 'Logged out successfully.',
  },
  CART: {
    ADDED: 'Added to your display list!',
    REMOVED: 'Removed from display list.',
    CLEARED: 'Display list cleared.',
  },
  ORDER: {
    SUCCESS: 'Professional display booked successfully!',
    ERROR: 'Booking failed. Please try again.',
    EMPTY_CART: 'Your arsenal is empty. Add effects before checkout.',
  },
};

export const PROMO = {
  CODE: 'DKIGNITE10',
  DISCOUNT_PERCENT: 10,
  SUCCESS: '10% Launch Discount applied!',
  INVALID: 'Invalid tactical code',
};

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
};
