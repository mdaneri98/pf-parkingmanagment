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

// ====== Error Messages ======
export const PRICE_ERROR_MESSAGES = {
  PRICE: {
    CREATE_FAILED: 'Failed to create price rule',
    UPDATE_FAILED: 'Failed to update price rule', 
    DELETE_FAILED: 'Failed to delete price rule',
    NOT_FOUND: 'Price rule not found',
    LOAD_FAILED: 'Failed to load price data',
  },
  VALIDATION: {
    PRICE_REQUIRED: 'Price is required',
    PRICE_MIN: `Price must be at least $${PRICE_CONSTANTS.VALIDATION.MIN_PRICE}`,
    PRICE_MAX: `Price cannot exceed $${PRICE_CONSTANTS.VALIDATION.MAX_PRICE}`,
    VEHICLE_TYPE_REQUIRED: 'Vehicle type is required',
    VALID_FROM_REQUIRED: 'Start date is required',
    VALID_TO_REQUIRED: 'End date is required',
    DATE_RANGE_INVALID: 'End date must be after start date',
    DATE_PAST: 'Date cannot be in the past',
    OVERLAPPING_PERIOD: 'This period overlaps with an existing price rule for the same vehicle type',
  },
  NETWORK: {
    CONNECTION_ERROR: 'Connection error. Please check your internet connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to manage prices for this parking lot.',
  },
} as const;

// ====== Success Messages ======
export const PRICE_SUCCESS_MESSAGES = {
  PRICE: {
    CREATED: 'Price rule created successfully!',
    UPDATED: 'Price rule updated successfully!',
    DELETED: 'Price rule deleted successfully!',
  },
} as const;

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
