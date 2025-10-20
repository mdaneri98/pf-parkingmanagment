// ====== Price Constants ======
export const PRICE_CONSTANTS = {
  VALIDATION: {
    MIN_PRICE: 0.01,
    MAX_PRICE: 9999.99,
    PRICE_DECIMAL_PLACES: 2,
  },
  FORMATTING: {
    CURRENCY_SYMBOL: '$',
    CURRENCY_LOCALE: 'en-US',
  },
  SORT: {
    DEFAULT: 'asc' as const,
    OPTIONS: ['asc', 'desc'] as const,
  },
  DATETIME: {
    FORMAT: 'YYYY-MM-DD HH:mm:ss',
    API_FORMAT: 'YYYY-MM-DDTHH:mm:ss',
    DISPLAY_FORMAT: 'MMM DD, YYYY HH:mm',
  },
} as const;

import { ERROR_MESSAGE_KEYS } from '@shared/constants/errorMessages';

// Feature-specific error message keys (shared keys imported from @shared/constants/errorMessages)
export const PRICE_ERROR_MESSAGE_KEYS = {
  PRICE: {
    CREATE_FAILED: 'notifications.error.createFailed',
    UPDATE_FAILED: 'notifications.error.updateFailed',
    DELETE_FAILED: 'notifications.error.deleteFailed',
    NOT_FOUND: 'errors.notFound',
    LOAD_FAILED: 'notifications.error.loadFailed',
  },
  VALIDATION: {
    PRICE_REQUIRED: 'validation.price.required',
    PRICE_MIN: 'validation.price.min',
    PRICE_MAX: 'validation.price.max',
    VEHICLE_TYPE_REQUIRED: 'validation.vehicleType.required',
    VALID_FROM_REQUIRED: 'validation.validFrom.required',
    VALID_TO_REQUIRED: 'validation.validTo.required',
    DATE_RANGE_INVALID: 'validation.dateRange.invalid',
    DATE_PAST: 'validation.date.past',
    OVERLAPPING_PERIOD: 'validation.price.overlappingPeriod',
  },
} as const;

// Re-export shared error message keys for convenience
export { ERROR_MESSAGE_KEYS };

// Translation keys for success messages
export const PRICE_SUCCESS_MESSAGE_KEYS = {
  PRICE: {
    CREATED: 'notifications.success.created',
    UPDATED: 'notifications.success.updated',
    DELETED: 'notifications.success.deleted',
  },
} as const;

// Deprecated: Keep for backward compatibility, will be removed
export const PRICE_ERROR_MESSAGES = PRICE_ERROR_MESSAGE_KEYS;
export const PRICE_SUCCESS_MESSAGES = PRICE_SUCCESS_MESSAGE_KEYS;

// ====== Helper Functions ======
// Vehicle type conversion functions are now imported from @shared/constants

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat(PRICE_CONSTANTS.FORMATTING.CURRENCY_LOCALE, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: PRICE_CONSTANTS.VALIDATION.PRICE_DECIMAL_PLACES,
    maximumFractionDigits: PRICE_CONSTANTS.VALIDATION.PRICE_DECIMAL_PLACES,
  }).format(price);
};

/**
 * Check if a price period is currently active
 */
export const isPriceActive = (validFrom: string, validTo: string): boolean => {
  const now = new Date();
  const startDate = new Date(validFrom);
  const endDate = new Date(validTo);
  
  return now >= startDate && now <= endDate;
};

/**
 * Check if a price period has expired
 */
export const isPriceExpired = (validTo: string): boolean => {
  const now = new Date();
  const endDate = new Date(validTo);
  
  return now > endDate;
};
