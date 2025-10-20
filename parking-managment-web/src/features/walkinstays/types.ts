import { ReservationStatus } from '@reservations/types';

// ====== Core Walk-in Stay Types ======

/**
 * Walk-in stay response from the API (extends ReservationResponse)
 */
export interface WalkInStayResponse {
  id: number;
  reservedStartTime: string; // ISO date string
  expectedEndTime: string; // ISO date string
  reservedEndTime: string; // ISO date string
  status: ReservationStatus;
  price: number;
  spotId: number;
  vehicleLicensePlate: string;
  userId: number;
  userName: string;
  userLastName: string;
  vehicleInfo: string;
  type: string;
  spotName: string;
}

/**
 * Request payload for creating a walk-in stay
 */
export interface WalkInStayRequest {
  spotId: number;
  vehicleLicensePlate: string;
  expectedDurationHours: number;
}

/**
 * Request payload for extending a walk-in stay
 */
export interface ExtendTimeRequest {
  extraHours: number;
}

// ====== UI-specific Types ======

/**
 * Form data for walk-in stay creation
 */
export interface WalkInStayFormData {
  licensePlate: string;
  expectedHours: number;
}

/**
 * Form data for extending walk-in stay
 */
export interface ExtendTimeFormData {
  extraHours: number;
}

/**
 * Remaining time response from API
 */
export interface RemainingTimeResponse {
  remainingMinutes: number;
}

// ====== Modal and State Types ======

export type WalkInStayModalType = 'createForm' | 'extendForm' | 'summary';

export interface WalkInStayModalState {
  createForm: boolean;
  extendForm: boolean;
  summary: boolean;
}

// ====== Loading States ======

export interface WalkInStayMutationLoadingStates {
  createWalkInStay: boolean;
  updateStatus: boolean;
  extend: boolean;
  isAnyLoading: boolean;
}

// ====== Time Threshold Types ======

export type TimeThresholdStatus = 'normal' | 'warning' | 'critical';

export interface TimeThresholdConfig {
  status: TimeThresholdStatus;
  colorClass: string;
  textClass: string;
  bgClass: string;
  icon: string;
}

export type WalkInStayResult<T> = 
  | { success: true; data: T }
  | { success: false; error: AppError };

// Re-export ReservationStatus for convenience
export { ReservationStatus };

