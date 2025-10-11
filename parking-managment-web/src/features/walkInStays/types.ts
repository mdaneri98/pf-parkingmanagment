import { PaginatedResponse } from '@shared/types';

export enum WalkInStayStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface WalkInStayResponse {
  id: number;
  spotId: number;
  spotName: string;
  vehicleLicensePlate: string;
  expectedDurationHours: number;
  startTime: string; // ISO date string
  expectedEndTime: string; // ISO date string
  actualEndTime?: string;
  status: WalkInStayStatus;
  price: number;
  userId?: number;
  userName?: string;
  userLastName?: string;
  vehicleInfo?: string;
  type?: string;
}

export interface CreateWalkInStayRequest {
  spotId: number;
  vehicleLicensePlate: string;
  expectedDurationHours: number;
}

export interface ExtendTimeRequest {
  extraHours: number;
}

export interface RemainingTimeResponse {
  remainingMinutes: number;
  isOvertime: boolean;
}

export interface WalkInStayFilters {
  userId?: number;
  vehiclePlate?: string;
  status?: WalkInStayStatus;
  parkingLotId?: number;
  page?: number;
  size?: number;
}
