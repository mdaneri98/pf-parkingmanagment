import type { TimeThresholdStatus, WalkInStayFormData } from '../types';
import { WALK_IN_STAY_CONSTANTS, WALK_IN_STAY_ERROR_MESSAGES } from '../constants/walkInStays';

/**
 * Format remaining time in minutes to human-readable string
 * @param minutes - Remaining time in minutes
 * @returns Formatted string like "2h 15m" or "45m"
 */
export const formatRemainingTime = (minutes: number | undefined): string => {
  if (minutes === undefined || minutes < 0) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours}h`;
  }
  
  return `${remainingMinutes}m`;
};

/**
 * Get time threshold status based on remaining minutes
 * @param minutes - Remaining time in minutes
 * @returns Status: 'normal', 'warning', or 'critical'
 */
export const getTimeThresholdStatus = (minutes: number | undefined): TimeThresholdStatus => {
  if (minutes === undefined || minutes < 0) return 'critical';
  
  const { WARNING, CRITICAL } = WALK_IN_STAY_CONSTANTS.TIME_THRESHOLD;
  
  if (minutes <= CRITICAL) return 'critical';
  if (minutes <= WARNING) return 'warning';
  return 'normal';
};

/**
 * Format ISO datetime string to human-readable format
 * @param isoString - ISO datetime string
 * @returns Formatted string like "Jan 15, 3:30 PM"
 */
export const formatDateTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format ISO datetime string to time only
 * @param isoString - ISO datetime string
 * @returns Formatted string like "3:30 PM"
 */
export const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Invalid time';
  }
};

/**
 * Calculate expected end time based on start time and duration
 * @param startTime - ISO datetime string of start time
 * @param hours - Duration in hours
 * @returns Date object of expected end time
 */
export const calculateExpectedEndTime = (startTime: string, hours: number): Date => {
  const start = new Date(startTime);
  return new Date(start.getTime() + hours * 60 * 60 * 1000);
};

/**
 * Validate license plate format
 * Basic validation: non-empty, alphanumeric, 3-10 characters
 * @param plate - License plate string
 * @returns true if valid, false otherwise
 */
export const validateLicensePlate = (plate: string): boolean => {
  if (!plate || plate.trim().length === 0) return false;
  
  const trimmed = plate.trim();
  // Allow alphanumeric characters, spaces, and hyphens
  const regex = /^[A-Z0-9\s-]{3,10}$/i;
  return regex.test(trimmed);
};

/**
 * Normalize license plate to uppercase without extra spaces
 * @param plate - License plate string
 * @returns Normalized license plate
 */
export const normalizeLicensePlate = (plate: string): string => {
  return plate.trim().toUpperCase().replace(/\s+/g, ' ');
};

/**
 * Validate walk-in stay form data
 * @param formData - Form data to validate
 * @returns Object with isValid flag and errors array
 */
export const validateWalkInStayForm = (formData: WalkInStayFormData): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // Validate license plate
  if (!formData.licensePlate || formData.licensePlate.trim().length === 0) {
    errors.push(WALK_IN_STAY_ERROR_MESSAGES.VALIDATION.LICENSE_PLATE_REQUIRED);
  } else if (!validateLicensePlate(formData.licensePlate)) {
    errors.push(WALK_IN_STAY_ERROR_MESSAGES.VALIDATION.LICENSE_PLATE_INVALID);
  }
  
  // Validate expected hours
  if (!formData.expectedHours) {
    errors.push(WALK_IN_STAY_ERROR_MESSAGES.VALIDATION.HOURS_REQUIRED);
  } else if (formData.expectedHours < WALK_IN_STAY_CONSTANTS.MIN_EXPECTED_HOURS) {
    errors.push(WALK_IN_STAY_ERROR_MESSAGES.VALIDATION.HOURS_MIN);
  } else if (formData.expectedHours > WALK_IN_STAY_CONSTANTS.MAX_EXPECTED_HOURS) {
    errors.push(WALK_IN_STAY_ERROR_MESSAGES.VALIDATION.HOURS_MAX);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format price to currency string
 * @param price - Price value
 * @returns Formatted price string like "$12.50"
 */
export const formatPrice = (price: number | undefined): string => {
  if (price === undefined || price === null) return '-';
  return `$${price.toFixed(2)}`;
};

/**
 * Check if walk-in stay is active (IN_USE status)
 * @param status - Reservation status
 * @returns true if active, false otherwise
 */
export const isActiveWalkInStay = (status: string): boolean => {
  return status === 'IN_USE' || status === 'ACTIVE';
};

/**
 * Parse remaining time text from API response
 * The API returns text like "Remaining: 45 minutes"
 * @param text - API response text
 * @returns Remaining minutes as number
 */
export const parseRemainingTimeText = (text: string): number => {
  const match = text.match(/(\d+)\s*minutes?/i);
  return match ? parseInt(match[1], 10) : 0;
};

export const formatDuration = (totalHours: number): string => {
  const totalMinutes = Math.round(totalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
};
