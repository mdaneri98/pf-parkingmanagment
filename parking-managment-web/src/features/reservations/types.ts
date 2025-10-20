import { PaginatedResponse } from '@shared/types';

export enum ReservationStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

export interface ReservationResponse {
    id: number;
    reservedStartTime: string; // ISO date string
    expectedEndTime: string; // ISO date string
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

export interface ReservationFilters {
    status?: ReservationStatus;
    from?: string; // ISO date string
    to?: string; // ISO date string
    page?: number;
    size?: number;
}