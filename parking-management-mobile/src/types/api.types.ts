/**
 * API Response Types
 * Based on backend API requirements document
 */

// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// ============================================================================
// Enums
// ============================================================================

export enum UserRole {
  USER = 'USER',
  MANAGER = 'MANAGER',
}

export enum VehicleType {
  AUTO = 'AUTO',
  MOTO = 'MOTO',
  CAMIONETA = 'CAMIONETA',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// ============================================================================
// User & Auth Types
// ============================================================================

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================================================
// Vehicle Types
// ============================================================================

export interface Vehicle {
  licensePlate: string;
  vehicleType: VehicleType;
  userId: number;
  createdAt: string;
}

export interface CreateVehicleRequest {
  licensePlate: string;
  vehicleType: VehicleType;
  userId: number;
}

export interface UpdateVehicleRequest {
  vehicleType: VehicleType;
}

// ============================================================================
// Parking Lot Types
// ============================================================================

export interface ParkingLot {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  availableSpots: number;
  managerId: number;
}

export interface ParkingLotWithDistance extends ParkingLot {
  distance: number; // in meters
  minPrice: number;
  maxPrice: number;
}

export interface NearbyParkingLotsRequest {
  latitude: number;
  longitude: number;
  radius?: number; // in km, default 5
  vehicleType?: VehicleType;
  minPrice?: number;
  maxPrice?: number;
  hasAvailableSpots?: boolean;
}

// ============================================================================
// Spot Types
// ============================================================================

export interface Spot {
  id: number;
  spotNumber: string;
  floor: number;
  isAvailable: boolean;
  isAccessible: boolean;
  isReservable: boolean;
  isCovered: boolean;
  vehicleType: string;
  parkingLotId: number;
}

export interface GetSpotsRequest {
  parkingLotId: number;
  available?: boolean;
  vehicleType?: string;
  floor?: number;
  isAccessible?: boolean;
  isReservable?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

// ============================================================================
// Reservation Types
// ============================================================================

export interface Reservation {
  id: number;
  spotId: number;
  userId: number;
  vehiclePlate: string;
  startTime: string; // ISO 8601 date string
  endTime: string; // ISO 8601 date string
  status: ReservationStatus;
  price: number;
  createdAt: string;
}

export interface CreateScheduledReservationRequest {
  spotId: number;
  vehiclePlate: string;
  startTime: string; // ISO 8601 date string
  endTime: string; // ISO 8601 date string
}

export interface GetReservationsRequest {
  userId: number;
  status?: ReservationStatus;
  vehiclePlate?: string;
  from?: string; // yyyy-MM-dd HH:mm:ss
  to?: string; // yyyy-MM-dd HH:mm:ss
  page?: number;
  size?: number;
}

// ============================================================================
// Walk-in Stay Types
// ============================================================================

export interface WalkInStay {
  id: number;
  spotId: number;
  userId: number;
  vehiclePlate: string;
  checkInTime: string; // ISO 8601 date string
  expectedEndTime: string; // ISO 8601 date string
  checkOutTime?: string; // ISO 8601 date string
  status: ReservationStatus;
  totalPrice?: number;
  createdAt: string;
}

export interface CreateWalkInStayRequest {
  spotId: number;
  vehiclePlate: string;
  expectedDurationHours: number;
}

export interface ExtendWalkInStayRequest {
  id: number;
  extraHours: number;
}

// ============================================================================
// Favorites Types (for future implementation)
// ============================================================================

export interface Favorite {
  id: number;
  userId: number;
  parkingLotId: number;
  createdAt: string;
}

export interface FavoriteWithParkingLot {
  id: number;
  parkingLot: ParkingLot;
  createdAt: string;
}

export interface CreateFavoriteRequest {
  parkingLotId: number;
}

// ============================================================================
// Notification Types (for future implementation)
// ============================================================================

export enum NotificationType {
  RESERVATION_CONFIRMED = 'RESERVATION_CONFIRMED',
  RESERVATION_REMINDER = 'RESERVATION_REMINDER',
  RESERVATION_EXPIRED = 'RESERVATION_EXPIRED',
  WALK_IN_EXPIRING = 'WALK_IN_EXPIRING',
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface GetNotificationsResponse {
  content: Notification[];
  page: number;
  totalElements: number;
  unreadCount: number;
}
