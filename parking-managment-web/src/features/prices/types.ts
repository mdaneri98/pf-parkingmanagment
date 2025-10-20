import type { BaseEntity } from '../users/types';
import type { VehicleType } from '@shared/constants';
import type { AppError } from '@shared/utils/errorHandling';

// ====== Core Price Types ======

/**
 * Parking price response from the API
 */
export interface ParkingPriceResponse extends BaseEntity {
  vehicleType: string; // API returns string like "CAR", "MOTORCYCLE"
  price: number;
  validFrom: string; // ISO datetime string
  validTo: string; // ISO datetime string
}

/**
 * Request payload for creating/updating parking prices
 */
export interface ParkingPriceRequest {
  vehicleType: string; // API expects string like "CAR", "MOTORCYCLE"
  price: number;
  validFrom: string; // ISO datetime string
  validTo: string; // ISO datetime string
}

// ====== Search and Filter Types ======

/**
 * Query parameters for searching parking prices
 */
export interface PriceSearchFilters {
  min?: number; // minimum price
  max?: number; // maximum price
  vehicleType?: string; // filter by vehicle type
  from?: string; // filter by start validity (ISO datetime)
  to?: string; // filter by end validity (ISO datetime)
  sort?: 'asc' | 'desc'; // price sorting
}

// ====== UI-specific Types ======

/**
 * Form data for price creation/editing (with proper date handling)
 */
export interface PriceFormData {
  vehicleType: VehicleType; // UI uses internal VehicleType enum
  price: number;
  validFrom: Date; // UI uses Date objects
  validTo: Date; // UI uses Date objects
}

/**
 * Price display data (combining API data with UI enhancements)
 */
export interface PriceDisplayData extends ParkingPriceResponse {
  isActive: boolean; // computed from validFrom/validTo
  isExpired: boolean; // computed from validTo
  formattedPrice: string; // formatted price string
  formattedValidFrom: string; // formatted date string
  formattedValidTo: string; // formatted date string
  vehicleTypeLabel: string; // human-readable vehicle type
  vehicleTypeIcon: string; // emoji for vehicle type
}

// ====== Modal and State Types ======

export type PriceModalType = 'create' | 'edit' | 'detail';

export interface PriceModalState {
  create: boolean;
  edit: boolean;
  detail: boolean;
}

export interface PriceConfirmDeleteState {
  type: 'price';
  id: number;
  priceInfo: {
    vehicleType: string;
    price: number;
    validFrom: string;
    validTo: string;
  };
}

export type PriceResult<T> = 
  | { success: true; data: T }
  | { success: false; error: AppError };

// ====== Loading States ======

export interface PriceMutationLoadingStates {
  createPrice: boolean;
  updatePrice: boolean;
  deletePrice: boolean;
  isAnyLoading: boolean;
}

// ====== Validation Types ======

export interface PriceValidationError {
  field: keyof PriceFormData;
  message: string;
}

export interface PriceValidationResult {
  isValid: boolean;
  errors: PriceValidationError[];
}
