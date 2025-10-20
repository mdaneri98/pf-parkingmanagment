// ====== Request Body Constants ======
// Vehicle types are now imported from shared constants
import { 
  VEHICLE_TYPES, 
  VehicleType, 
  getVehicleTypeOptions, 
  VEHICLE_ICONS 
} from '@shared/constants';

// Re-export vehicle types for backward compatibility
export { 
  VEHICLE_TYPES, 
  getVehicleTypeOptions, 
  VEHICLE_ICONS 
};
export type { VehicleType };

export const PARKING_CONSTANTS = {
  POLLING: {
    DASHBOARD_INTERVAL: 30000, // 30 seconds
    METRICS_INTERVAL: 10000,   // 10 seconds
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    FETCH_ALL_SIZE: 10000,
  },
  VALIDATION: {
    SPOT_CODE_MAX_LENGTH: 10,
    SPOT_CODE_MIN_LENGTH: 1,
    LOT_NAME_MAX_LENGTH: 100,
    LOT_NAME_MIN_LENGTH: 1,
    MAX_FLOOR: 50,
    MIN_FLOOR: 0,
  },
  COLORS: {
    AVAILABLE: 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100',
    OCCUPIED: 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100',
    UNKNOWN: 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100',
  },
  NOTIFICATIONS: {
    SUCCESS_DURATION: 3000,
    ERROR_DURATION: 5000,
  },
  METRICS: {
    EMPTY: {
      totalSpots: 0,
      availableSpots: 0,
      occupiedSpots: 0,
      occupancyRate: 0,
      spotDistribution: {
        byVehicleType: {
          [VEHICLE_TYPES.CAR]: 0,
          [VEHICLE_TYPES.MOTORCYCLE]: 0,
          [VEHICLE_TYPES.TRUCK]: 0,
          [VEHICLE_TYPES.BICICLE]: 0,
        },
        byFloor: {},
        byAvailability: { available: 0, occupied: 0 },
      },
    },
  },
} as const;

import { ERROR_MESSAGE_KEYS } from '@shared/constants/errorMessages';

// Feature-specific error message keys (shared keys imported from @shared/constants/errorMessages)
export const PARKING_ERROR_MESSAGE_KEYS = {
  SPOT: {
    CREATE_FAILED: 'notifications.error.createFailed',
    UPDATE_FAILED: 'notifications.error.updateFailed',
    DELETE_FAILED: 'notifications.error.deleteFailed',
    NOT_FOUND: 'errors.notFound',
  },
  LOT: {
    CREATE_FAILED: 'notifications.error.createFailed',
    UPDATE_FAILED: 'notifications.error.updateFailed',
    DELETE_FAILED: 'notifications.error.deleteFailed',
    NOT_FOUND: 'errors.parkingLotNotFound',
    LOAD_FAILED: 'notifications.error.loadFailed',
  },
} as const;

// Re-export shared error message keys for convenience
export { ERROR_MESSAGE_KEYS };

// Translation keys for success messages
export const SUCCESS_MESSAGE_KEYS = {
  SPOT: {
    CREATED: 'notifications.success.created',
    UPDATED: 'notifications.success.updated',
    DELETED: 'notifications.success.deleted',
  },
  LOT: {
    CREATED: 'notifications.success.created',
    UPDATED: 'notifications.success.updated',
    DELETED: 'notifications.success.deleted',
  },
} as const;

// Deprecated: Keep for backward compatibility, will be removed
export const ERROR_MESSAGES = ERROR_MESSAGE_KEYS;
export const SUCCESS_MESSAGES = SUCCESS_MESSAGE_KEYS;
