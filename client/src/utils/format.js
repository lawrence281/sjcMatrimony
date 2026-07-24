import { CURRENCY_LOCALE, CURRENCY_SYMBOL } from '../constants';

export const formatPrice = (price) => {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price).replace('INR', CURRENCY_SYMBOL).trim();
};
