import type { BaseEntity } from '../users/types';
import type { VehicleType } from '@shared/constants';

// ====== Core Domain Types ======
export interface ParkingLotCoordinates {
  latitude: number;
  longitude: number;
}

export interface SpotDTO extends BaseEntity {
  vehicleType: VehicleType;
  floor: number;
  code: string;
  isAvailable: boolean;
  parkingLotId: number;
}

export interface ParkingLotResponse extends BaseEntity {
  name: string;
  address: string;
  imageUrl: string | null;
  managerId: number;
  spots: SpotDTO[];
  coordinates?: ParkingLotCoordinates;
}

// ====== Dashboard Domain Types ======
export interface DashboardMetrics {
  readonly totalSpots: number;
  readonly availableSpots: number;
  readonly occupiedSpots: number;
  readonly occupancyRate: number;
  readonly spotDistribution: {
    byVehicleType: Record<VehicleType, number>;
    byFloor: Record<number, number>;
    byAvailability: { available: number; occupied: number };
  };
}

export interface AvailableFilters {
  floors: number[];
  vehicleTypes: string[];
}

export interface DashboardContextData {
  selectedLotId: number | null;
  managerLots: ParkingLotResponse[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

// ====== API Query Types ======
export interface SpotFilters {
  available?: boolean;
  vehicleType?: VehicleType | string; 
  floor?: number;
  page?: number;
  size?: number;
  sort?: string;
}

// ====== Request Types for Mutations ======
export interface CreateParkingLotRequest {
  name: string;
  address: string;
  imageUrl?: string | null;
  latitude: number;
  longitude: number;
}

export interface UpdateParkingLotRequest {
  name?: string;
  address?: string;
  imageUrl?: string | null;
  latitude?: number;
  longitude?: number;
}

export interface CreateSpotRequest {
  parkingLotId: number;
  floor: number;
  code: string;
  vehicleType: VehicleType;
  isAvailable?: boolean;
}

export interface UpdateSpotRequest {
  floor?: number;
  code?: string;
  vehicleType?: VehicleType;
  isAvailable?: boolean;
}

// ====== Modal State Types ======
export type ModalType = 'spotDetail' | 'createSpot' | 'editSpot';

export interface ModalState {
  spotDetail: boolean;
  createSpot: boolean;
  editSpot: boolean;
}

export interface ConfirmDeleteState {
  type: 'spot';
  id: number;
}

// ====== Error Handling Types ======
export class ParkingError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ParkingError';
  }
}

export type ParkingResult<T> = 
  | { success: true; data: T }
  | { success: false; error: ParkingError };

// ====== Loading States ======
export interface MutationLoadingStates {
  createSpot: boolean;
  updateSpot: boolean;
  deleteSpot: boolean;
  createLot: boolean;
  updateLot: boolean;
  deleteLot: boolean;
  isAnyLoading: boolean;
}
