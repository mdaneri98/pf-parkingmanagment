import type { TimeThresholdConfig, TimeThresholdStatus } from '../types';
import { ReservationStatus } from '../types';

// ====== Polling Configuration ======

export const WALK_IN_STAY_CONSTANTS = {
  POLLING: {
    REMAINING_TIME_INTERVAL: 60000, // 1 minute
  },
  TIME_THRESHOLD: {
    WARNING: 15, // minutes
    CRITICAL: 5, // minutes
  },
  EXTEND_OPTIONS: [1, 2, 3, 4, 6, 8], // hours
  MIN_EXPECTED_HOURS: 1,
  MAX_EXPECTED_HOURS: 24,
} as const;

// ====== UI Labels ======

export const UI_LABELS = {
  CREATE_WALK_IN_STAY: 'Create Walk-in Stay',
  EXTEND_TIME: 'Extend Time',
  COMPLETE_STAY: 'Complete Stay',
  LICENSE_PLATE: 'License Plate',
  LICENSE_PLATE_PLACEHOLDER: 'ABC123',
  EXPECTED_HOURS: 'Expected Duration (hours)',
  EXTRA_HOURS: 'Additional Hours',
  CURRENT_EXPIRY: 'Current Expiry',
  REMAINING_TIME: 'Remaining Time',
  STARTED_AT: 'Started At',
  EXPECTED_END: 'Expected End',
  VEHICLE: 'Vehicle',
  PRICE: 'Price',
  SUBMIT: 'Submit',
  CANCEL: 'Cancel',
  CONFIRM: 'Confirm',
  EXTEND: 'Extend',
  COMPLETE: 'Complete',
  ACTIVE: 'Active',
  TIME_WARNING: 'Time running out!',
  TIME_CRITICAL: 'Time almost up!',
} as const;

// ====== Success Messages ======

export const WALK_IN_STAY_SUCCESS_MESSAGES = {
  CREATED: 'Walk-in stay created successfully',
  EXTENDED: 'Stay extended successfully',
  COMPLETED: 'Stay completed successfully',
  STATUS_UPDATED: 'Status updated successfully',
} as const;

// ====== Error Messages ======

export const WALK_IN_STAY_ERROR_MESSAGES = {
  CREATE_FAILED: 'Failed to create walk-in stay',
  EXTEND_FAILED: 'Failed to extend stay',
  COMPLETE_FAILED: 'Failed to complete stay',
  STATUS_UPDATE_FAILED: 'Failed to update status',
  FETCH_FAILED: 'Failed to load walk-in stay data',
  REMAINING_TIME_FAILED: 'Failed to fetch remaining time',
  VALIDATION: {
    LICENSE_PLATE_REQUIRED: 'License plate is required',
    LICENSE_PLATE_INVALID: 'Invalid license plate format',
    HOURS_REQUIRED: 'Expected hours is required',
    HOURS_MIN: `Expected hours must be at least ${WALK_IN_STAY_CONSTANTS.MIN_EXPECTED_HOURS}`,
    HOURS_MAX: `Expected hours cannot exceed ${WALK_IN_STAY_CONSTANTS.MAX_EXPECTED_HOURS}`,
  },
  UNAUTHORIZED: 'Not authorized to manage this walk-in stay',
  NOT_FOUND: 'Walk-in stay not found',
  SPOT_OCCUPIED: 'Spot is already occupied',
} as const;

// ====== Status Colors ======

export const STATUS_COLORS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  [ReservationStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  [ReservationStatus.IN_USE]: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  [ReservationStatus.COMPLETED]: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/20 dark:text-neutral-400',
  [ReservationStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  [ReservationStatus.NO_SHOW]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
} as const;

// ====== Time Threshold Configs ======

export const TIME_THRESHOLD_CONFIGS: Record<TimeThresholdStatus, TimeThresholdConfig> = {
  normal: {
    status: 'normal',
    colorClass: 'text-green-600 dark:text-green-400',
    textClass: 'text-green-900 dark:text-green-100',
    bgClass: 'bg-green-50 dark:bg-green-900/20',
    icon: '🟢',
  },
  warning: {
    status: 'warning',
    colorClass: 'text-yellow-600 dark:text-yellow-400',
    textClass: 'text-yellow-900 dark:text-yellow-100',
    bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: '⚠️',
  },
  critical: {
    status: 'critical',
    colorClass: 'text-red-600 dark:text-red-400',
    textClass: 'text-red-900 dark:text-red-100',
    bgClass: 'bg-red-50 dark:bg-red-900/20',
    icon: '🔴',
  },
} as const;

