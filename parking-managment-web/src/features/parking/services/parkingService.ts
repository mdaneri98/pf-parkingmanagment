import type { SpotDTO, DashboardMetrics } from '../types';
import { PARKING_CONSTANTS, VEHICLE_TYPES, VehicleType } from '../constants/parking';
import { VEHICLE_ICONS } from '@shared/constants';

/**
 * Business logic service for parking operations
 * Keeps complex calculations and business rules separate from components
 */
export class ParkingService {
  /**
   * Calculates comprehensive dashboard metrics from spots data
   */
  static calculateDashboardMetrics(spots: SpotDTO[]): DashboardMetrics {
    if (!spots.length) {
      return PARKING_CONSTANTS.METRICS.EMPTY;
    }

    const totalSpots = spots.length;
    const availableSpots = spots.filter(spot => spot.isAvailable).length;
    const occupiedSpots = totalSpots - availableSpots;
    const occupancyRate = Math.round((occupiedSpots / totalSpots) * 100);

    // Calculate distribution by vehicle type
    const byVehicleType = spots.reduce((acc, spot) => {
      const vehicleType = spot.vehicleType as VehicleType;
      acc[vehicleType] = (acc[vehicleType] || 0) + 1;
      return acc;
    }, {} as Record<VehicleType, number>);

    // Calculate distribution by floor
    const byFloor = spots.reduce((acc, spot) => {
      acc[spot.floor] = (acc[spot.floor] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalSpots,
      availableSpots,
      occupiedSpots,
      occupancyRate,
      spotDistribution: {
        byVehicleType,
        byFloor,
        byAvailability: { available: availableSpots, occupied: occupiedSpots },
      },
    };
  }

  /**
   * Gets the appropriate icon for a vehicle type
   */
  static getVehicleIcon(vehicleType: VehicleType): string {
    return VEHICLE_ICONS[vehicleType] || '🚗';
  }

  /**
   * Gets the appropriate CSS classes for spot status
   */
  static getSpotStatusClasses(isAvailable: boolean): string {
    return isAvailable 
      ? PARKING_CONSTANTS.COLORS.AVAILABLE
      : PARKING_CONSTANTS.COLORS.OCCUPIED;
  }

  /**
   * Filters spots based on provided criteria
   */
  static filterSpots(
    spots: SpotDTO[], 
    filters: {
      available?: boolean;
      vehicleType?: string;
      floor?: number;
      isAccessible?: boolean;
      isReservable?: boolean;
    }
  ): SpotDTO[] {
    return spots.filter(spot => {
      if (filters.available !== undefined && spot.isAvailable !== filters.available) {
        return false;
      }
      
      if (filters.vehicleType && spot.vehicleType.toLowerCase() !== filters.vehicleType.toLowerCase()) {
        return false;
      }
      
      if (filters.floor !== undefined && spot.floor !== filters.floor) {
        return false;
      }
      
      if (filters.isAccessible !== undefined && spot.isAccessible !== filters.isAccessible) {
        return false;
      }
      
      if (filters.isReservable !== undefined && spot.isReservable !== filters.isReservable) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Sorts spots by various criteria
   */
  static sortSpots(spots: SpotDTO[], sortBy: 'code' | 'floor' | 'vehicleType' | 'status'): SpotDTO[] {
    return [...spots].sort((a, b) => {
      switch (sortBy) {
        case 'code':
          return a.code.localeCompare(b.code);
        case 'floor':
          return a.floor - b.floor;
        case 'vehicleType':
          return a.vehicleType.localeCompare(b.vehicleType);
        case 'status':
          // Available first, then occupied
          if (a.isAvailable === b.isAvailable) return 0;
          return a.isAvailable ? -1 : 1;
        default:
          return 0;
      }
    });
  }

  /**
   * Validates spot data before creation/update
   */
  static validateSpotData(data: {
    code: string;
    floor: number;
    vehicleType: VehicleType;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate code
    if (!data.code || data.code.trim().length === 0) {
      errors.push('Spot code is required');
    } else if (data.code.length > PARKING_CONSTANTS.VALIDATION.SPOT_CODE_MAX_LENGTH) {
      errors.push(`Spot code cannot exceed ${PARKING_CONSTANTS.VALIDATION.SPOT_CODE_MAX_LENGTH} characters`);
    }

    // Validate floor
    if (data.floor < PARKING_CONSTANTS.VALIDATION.MIN_FLOOR || data.floor > PARKING_CONSTANTS.VALIDATION.MAX_FLOOR) {
      errors.push(`Floor must be between ${PARKING_CONSTANTS.VALIDATION.MIN_FLOOR} and ${PARKING_CONSTANTS.VALIDATION.MAX_FLOOR}`);
    }

    // Validate vehicle type
    if (!Object.values(VEHICLE_TYPES).includes(data.vehicleType)) {
      errors.push('Invalid vehicle type');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates parking lot data before creation/update
   */
  static validateParkingLotData(data: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate name
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Parking lot name is required');
    } else if (data.name.length > PARKING_CONSTANTS.VALIDATION.LOT_NAME_MAX_LENGTH) {
      errors.push(`Name cannot exceed ${PARKING_CONSTANTS.VALIDATION.LOT_NAME_MAX_LENGTH} characters`);
    }

    // Validate address
    if (!data.address || data.address.trim().length === 0) {
      errors.push('Address is required');
    }

    // Validate coordinates if provided
    if (data.latitude !== undefined) {
      if (data.latitude < -90 || data.latitude > 90) {
        errors.push('Latitude must be between -90 and 90');
      }
    }

    if (data.longitude !== undefined) {
      if (data.longitude < -180 || data.longitude > 180) {
        errors.push('Longitude must be between -180 and 180');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generates available filter options from spots data
   */
  static generateFilterOptions(spots: SpotDTO[]): {
    floors: number[];
    vehicleTypes: string[];
  } {
    const floors = Array.from(new Set(spots.map(s => s.floor))).sort((a, b) => a - b);
    const vehicleTypes = Array.from(new Set(spots.map(s => s.vehicleType.toLowerCase())));

    return { floors, vehicleTypes };
  }

  /**
   * Checks if a spot code is unique within a parking lot
   */
  static isSpotCodeUnique(code: string, existingSpots: SpotDTO[], excludeSpotId?: number): boolean {
    return !existingSpots.some(spot => 
      spot.code.toLowerCase() === code.toLowerCase() && 
      spot.id !== excludeSpotId
    );
  }
}
