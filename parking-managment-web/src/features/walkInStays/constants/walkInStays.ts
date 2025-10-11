import { WalkInStayStatus } from '../types';

// ====== Walk In Stay Constants ======
export const WALK_IN_STAY_CONSTANTS = {
  VALIDATION: {
    MIN_DURATION_HOURS: 0.5,
    MAX_DURATION_HOURS: 24,
    MAX_LICENSE_PLATE_LENGTH: 10,
  },
  FORMATTING: {
    CURRENCY_SYMBOL: '$',
    CURRENCY_LOCALE: 'en-US',
    DATE_FORMAT: 'MMM DD, YYYY',
    TIME_FORMAT: 'HH:mm',
    DATETIME_FORMAT: 'MMM DD, YYYY HH:mm',
  },
  SORT: {
    DEFAULT: 'startTime' as const,
    DIRECTION: 'desc' as const,
    OPTIONS: ['startTime', 'expectedEndTime', 'status', 'price'] as const,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  },
  POLLING: {
    REMAINING_TIME_INTERVAL: 30000, // 30 seconds
  },
} as const;

// ====== Status Configuration ======
export const WALK_IN_STAY_STATUS = {
  [WalkInStayStatus.PENDING]: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
  },
  [WalkInStayStatus.ACTIVE]: {
    label: 'Active',
    color: 'bg-green-100 text-green-800',
  },
  [WalkInStayStatus.COMPLETED]: {
    label: 'Completed',
    color: 'bg-blue-100 text-blue-800',
  },
  [WalkInStayStatus.CANCELLED]: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
  },
} as const;

// ====== Error Messages ======
export const WALK_IN_STAY_ERROR_MESSAGES = {
  WALK_IN_STAY: {
    NOT_FOUND: 'Walk-in stay not found',
    LOAD_FAILED: 'Failed to load walk-in stays',
    UPDATE_FAILED: 'Failed to update walk-in stay',
    CANCEL_FAILED: 'Failed to cancel walk-in stay',
    CREATE_FAILED: 'Failed to create walk-in stay',
    EXTEND_FAILED: 'Failed to extend stay time',
  },
  VALIDATION: {
    VEHICLE_REQUIRED: 'Vehicle license plate is required',
    SPOT_REQUIRED: 'Parking spot is required',
    DURATION_REQUIRED: 'Expected duration is required',
    DURATION_MIN: `Duration must be at least ${WALK_IN_STAY_CONSTANTS.VALIDATION.MIN_DURATION_HOURS} hours`,
    DURATION_MAX: `Duration cannot exceed ${WALK_IN_STAY_CONSTANTS.VALIDATION.MAX_DURATION_HOURS} hours`,
    LICENSE_PLATE_REQUIRED: 'License plate is required',
    LICENSE_PLATE_MAX: `License plate cannot exceed ${WALK_IN_STAY_CONSTANTS.VALIDATION.MAX_LICENSE_PLATE_LENGTH} characters`,
  },
  NETWORK: {
    CONNECTION_ERROR: 'Connection error. Please check your internet connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to manage walk-in stays.',
  },
} as const;

// ====== Success Messages ======
export const WALK_IN_STAY_SUCCESS_MESSAGES = {
  CREATED: 'Walk-in stay created successfully',
  UPDATED: 'Walk-in stay updated successfully',
  EXTENDED: 'Stay time extended successfully',
  CANCELLED: 'Walk-in stay cancelled successfully',
} as const;

// ====== Utility Functions ======

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(WALK_IN_STAY_CONSTANTS.FORMATTING.CURRENCY_LOCALE, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDateTime = (dateString: string, includeTime = true): string => {
  // Handle null, undefined, or invalid date strings
  if (!dateString || dateString.trim() === '') {
    return '-';
  }

  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return '-';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = true;
  }

  return date.toLocaleString(WALK_IN_STAY_CONSTANTS.FORMATTING.CURRENCY_LOCALE, options);
};

export const formatRemainingTime = (minutes: number): string => {
  if (minutes < 0) {
    return `Overdue by ${Math.abs(minutes)} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  
  return `${remainingMinutes}m`;
};

export const calculateDuration = (start: string, end: string): number => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) * 100) / 100; // Hours with 2 decimal places
};

export const isWalkInStayActive = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  return now >= start && now <= end;
};

export const isWalkInStayUpcoming = (startTime: string): boolean => {
  return new Date(startTime) > new Date();
};

export const getStatusLabel = (status: WalkInStayStatus): string => {
  return WALK_IN_STAY_STATUS[status]?.label || status;
};

export const getStatusColor = (status: WalkInStayStatus): string => {
  return WALK_IN_STAY_STATUS[status]?.color || 'bg-gray-100 text-gray-800';
};
