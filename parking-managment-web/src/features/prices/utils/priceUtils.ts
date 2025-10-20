import type { 
  ParkingPriceResponse, 
  ParkingPriceRequest, 
  PriceFormData,
  PriceDisplayData,
  PriceValidationError,
  PriceValidationResult,
} from '../types';
import { getVehicleTypeOptions, VEHICLE_ICONS } from '@shared/constants';
import {
  formatPrice,
  isPriceActive,
  isPriceExpired,
  PRICE_CONSTANTS,
  PRICE_ERROR_MESSAGE_KEYS,
} from '../constants/prices';

// ====== Data Transformation Utils ======

/**
 * Convert form data to API request format
 */
export const formDataToApiRequest = (formData: PriceFormData): ParkingPriceRequest => {
  return {
    vehicleType: formData.vehicleType, 
    price: Number(formData.price.toFixed(PRICE_CONSTANTS.VALIDATION.PRICE_DECIMAL_PLACES)),
    validFrom: formatDateTimeForBackend(formData.validFrom),
    validTo: formatDateTimeForBackend(formData.validTo),
  };
};

/**
 * Convert API response to form data format
 */
export const apiResponseToFormData = (apiResponse: ParkingPriceResponse): PriceFormData => {
  return {
    vehicleType: apiResponse.vehicleType as any,
    price: apiResponse.price,
    validFrom: new Date(apiResponse.validFrom),
    validTo: new Date(apiResponse.validTo),
  };
};

/**
 * Enhance API response with display data
 */
export const enhancePriceForDisplay = (price: ParkingPriceResponse): PriceDisplayData => {
  const vehicleTypeOptions = getVehicleTypeOptions();
  const vehicleOption = vehicleTypeOptions.find(opt => opt.value === price.vehicleType);

  return {
    ...price,
    isActive: isPriceActive(price.validFrom, price.validTo),
    isExpired: isPriceExpired(price.validTo),
    formattedPrice: formatPrice(price.price),
    formattedValidFrom: formatDateTime(price.validFrom),
    formattedValidTo: formatDateTime(price.validTo),
    vehicleTypeLabel: vehicleOption?.label || price.vehicleType,
    vehicleTypeIcon: vehicleOption?.icon || VEHICLE_ICONS[price.vehicleType as keyof typeof VEHICLE_ICONS] || '🚗',
  };
};

// ====== Date/Time Utils ======

/**
 * Format datetime string for display
 */
export const formatDateTime = (dateTimeString: string): string => {
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return dateTimeString; // fallback to original string if parsing fails
  }
};

/**
 * Format datetime for HTML datetime-local input
 */
export const formatDateTimeForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:00`;
};

/**
 * Parse datetime-local input value to Date
 */
export const parseDateTimeFromInput = (inputValue: string): Date => {
  return new Date(inputValue);
};

/**
 * Format datetime for backend API (yyyy-MM-dd HH:mm:ss format)
 */
export const formatDateTimeForBackend = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// ====== Validation Utils ======

/**
 * Validate price form data
 */
export const validatePriceFormData = (
  formData: PriceFormData, 
  existingPrices?: ParkingPriceResponse[],
  excludeId?: number
): PriceValidationResult => {
  const errors: PriceValidationError[] = [];

  // Validate price
  if (!formData.price && formData.price !== 0) {
    errors.push({
      field: 'price',
      message: PRICE_ERROR_MESSAGE_KEYS.VALIDATION.PRICE_REQUIRED,
    });
  } else if (formData.price < PRICE_CONSTANTS.VALIDATION.MIN_PRICE) {
    errors.push({
      field: 'price',
      message: PRICE_ERROR_MESSAGE_KEYS.VALIDATION.PRICE_MIN,
    });
  } else if (formData.price > PRICE_CONSTANTS.VALIDATION.MAX_PRICE) {
    errors.push({
      field: 'price',
      message: PRICE_ERROR_MESSAGE_KEYS.VALIDATION.PRICE_MAX,
    });
  }

  // Validate vehicle type
  if (!formData.vehicleType) {
    errors.push({
      field: 'vehicleType',
      message: PRICE_ERROR_MESSAGE_KEYS.VALIDATION.VEHICLE_TYPE_REQUIRED,
    });
  }

  // Validate dates
  if (!formData.validFrom) {
    errors.push({
      field: 'validFrom',
      message: PRICE_ERROR_MESSAGE_KEYS.VALIDATION.VALID_FROM_REQUIRED,
    });
  }

  if (!formData.validTo) {
    errors.push({
      field: 'validTo',
      message: PRICE_ERROR_MESSAGE_KEYS.VALIDATION.VALID_TO_REQUIRED,
    });
  }

  // Validate date range
  if (formData.validFrom && formData.validTo) {
    if (formData.validTo <= formData.validFrom) {
      errors.push({
        field: 'validTo',
        message: PRICE_ERROR_MESSAGE_KEYS.VALIDATION.DATE_RANGE_INVALID,
      });
    }

    // Check if start date is in the past (with some tolerance for current day)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(formData.validFrom.getFullYear(), formData.validFrom.getMonth(), formData.validFrom.getDate());
    
    if (startDate < today) {
      errors.push({
        field: 'validFrom',
        message: PRICE_ERROR_MESSAGE_KEYS.VALIDATION.DATE_PAST,
      });
    }
  }

  // Check for overlapping periods with existing prices
  if (existingPrices && formData.validFrom && formData.validTo && formData.vehicleType) {
    const overlappingPrices = findOverlappingPrices(existingPrices, {
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      vehicleType: formData.vehicleType
    }, excludeId);
    
    if (overlappingPrices.length > 0) {
      errors.push({
        field: 'validFrom',
        message: PRICE_ERROR_MESSAGE_KEYS.VALIDATION.OVERLAPPING_PERIOD,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate price form data with existing prices for overlap checking
 * This is a convenience function that combines basic validation with overlap checking
 */
export const validatePriceFormDataWithOverlap = (
  formData: PriceFormData,
  existingPrices: ParkingPriceResponse[],
  excludeId?: number
): PriceValidationResult => {
  return validatePriceFormData(formData, existingPrices, excludeId);
};

// ====== Search/Filter Utils ======

/**
 * Build search filters for API query
 */
export const buildPriceSearchFilters = (filters: {
  minPrice?: number;
  maxPrice?: number;
  vehicleType?: string;
  startDate?: Date;
  endDate?: Date;
  sort?: 'asc' | 'desc';
}) => {
  const searchFilters: any = {};

  if (filters.minPrice !== undefined) {
    searchFilters.min = filters.minPrice;
  }

  if (filters.maxPrice !== undefined) {
    searchFilters.max = filters.maxPrice;
  }

  if (filters.vehicleType) {
    searchFilters.vehicleType = filters.vehicleType;
  }

  if (filters.startDate) {
    searchFilters.from = filters.startDate.toISOString();
  }

  if (filters.endDate) {
    searchFilters.to = filters.endDate.toISOString();
  }

  if (filters.sort) {
    searchFilters.sort = filters.sort;
  }

  return searchFilters;
};

// ====== Sorting Utils ======

/**
 * Sort prices by different criteria
 */
export const sortPrices = (
  prices: PriceDisplayData[], 
  sortBy: 'price' | 'vehicleType' | 'validFrom' | 'validTo' = 'price',
  order: 'asc' | 'desc' = 'asc'
): PriceDisplayData[] => {
  return [...prices].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'vehicleType':
        comparison = a.vehicleTypeLabel.localeCompare(b.vehicleTypeLabel);
        break;
      case 'validFrom':
        comparison = new Date(a.validFrom).getTime() - new Date(b.validFrom).getTime();
        break;
      case 'validTo':
        comparison = new Date(a.validTo).getTime() - new Date(b.validTo).getTime();
        break;
    }

    return order === 'desc' ? -comparison : comparison;
  });
};

// ====== Period Overlap Utils ======

/**
 * Check if two price periods overlap for the same vehicle type
 */
export const doPricePeriodsOverlap = (
  period1: { validFrom: string | Date; validTo: string | Date; vehicleType: string },
  period2: { validFrom: string | Date; validTo: string | Date; vehicleType: string }
): boolean => {
  // Only check overlap for same vehicle type
  if (period1.vehicleType !== period2.vehicleType) {
    return false;
  }

  const start1 = new Date(period1.validFrom);
  const end1 = new Date(period1.validTo);
  const start2 = new Date(period2.validFrom);
  const end2 = new Date(period2.validTo);

  // Check if periods overlap: start1 <= end2 && start2 <= end1
  return start1 <= end2 && start2 <= end1;
};

/**
 * Find overlapping prices in a list
 */
export const findOverlappingPrices = (
  prices: ParkingPriceResponse[],
  newPrice: { validFrom: string | Date; validTo: string | Date; vehicleType: string },
  excludeId?: number
): ParkingPriceResponse[] => {
  return prices.filter(price => {
    if (excludeId && price.id === excludeId) {
      return false; // Exclude the price being edited
    }
    
    return doPricePeriodsOverlap(price, newPrice);
  });
};

/**
 * Convierte un valor de precio formateado (ej: "1.300,50", "1300", "$1,300") a número.
 */
export const parsePrice = (value: string | number | undefined): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;

  let cleaned = value.trim();

  // Quitar cualquier símbolo que no sea dígito, punto o coma
  cleaned = cleaned.replace(/[^0-9.,-]/g, '');

  // Si no contiene ni punto ni coma, devolver número directo
  if (!cleaned.includes('.') && !cleaned.includes(',')) {
    return parseFloat(cleaned);
  }

  // Si contiene ambos (punto y coma)
  if (cleaned.includes('.') && cleaned.includes(',')) {
    // Si el último símbolo es coma → coma = decimal, punto = miles
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      return parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
    }
    // Si el último símbolo es punto → punto = decimal, coma = miles
    return parseFloat(cleaned.replace(/,/g, ''));
  }

  // Si contiene solo coma
  if (cleaned.includes(',') && !cleaned.includes('.')) {
    const parts = cleaned.split(',');
    // Si hay más de 3 dígitos después de la coma, no es decimal → eliminar coma
    if (parts[1] && parts[1].length > 2) {
      return parseFloat(cleaned.replace(/,/g, ''));
    }
    return parseFloat(cleaned.replace(',', '.'));
  }

  // Si contiene solo punto
  if (cleaned.includes('.') && !cleaned.includes(',')) {
    const parts = cleaned.split('.');
    // Si hay más de 3 dígitos después del punto, no es decimal → eliminar punto
    if (parts[1] && parts[1].length > 2) {
      return parseFloat(cleaned.replace(/\./g, ''));
    }
    return parseFloat(cleaned);
  }

  return parseFloat(cleaned);
};

/**
 * Devuelve un string formateado como moneda argentina (ARS)
 * Ejemplo: 1300 → "$ 1.300,00"
 */
export const formatARS = (value: string | number | undefined): string => {
  const numeric = parsePrice(value);
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(numeric);
};

