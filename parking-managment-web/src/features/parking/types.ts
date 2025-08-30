import type { BaseEntity } from '../users/types';


export const VEHICLE_TYPES = {
  CAR: 'CAR',
  MOTORCYCLE: 'MOTORCYCLE',
  TRUCK: 'TRUCK',
} as const;

export type VehicleType = keyof typeof VEHICLE_TYPES; // 'CAR' | 'MOTORCYCLE' | 'TRUCK'

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
  imageUrl: string;
  managerId: number;
  spots: SpotDTO[];
}

// Spot filters for API queries
export interface SpotFilters {
  available?: boolean;
  vehicleType?: VehicleType | string; 
  floor?: number;
  page?: number;
  size?: number;
  sort?: string;
}

// Request types for mutations
export interface CreateParkingLotRequest {
  name: string;
  address: string;
  imageUrl?: string;
  managerId: number;
  spots?: CreateSpotRequest[];
}

export interface UpdateParkingLotRequest {
  name?: string;
  address?: string;
  imageUrl?: string;
}

export interface CreateSpotRequest {
  parkingLotId: number;
  floor: number;
  code: string;
  vehicleType: VehicleType;
  isAvailable?: boolean;
}

export interface UpdateSpotRequest {
  parkingLotId?: number;
  floor?: number;
  code?: string;
  vehicleType?: VehicleType;
  isAvailable?: boolean;
}
