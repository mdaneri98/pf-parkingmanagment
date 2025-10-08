import { PaginatedResponse } from '@shared/types';

export enum ReservationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    IN_USE = 'IN_USE',
    NO_SHOW = 'NO_SHOW',
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