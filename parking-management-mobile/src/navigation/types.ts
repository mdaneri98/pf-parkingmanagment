/**
 * Navigation Types
 * Type definitions for navigation stacks and routes
 */

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// ============================================================================
// Auth Stack
// ============================================================================

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// ============================================================================
// Main Stack (Tabs)
// ============================================================================

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Reservations: undefined;
  Profile: undefined;
};

// ============================================================================
// Root Stack
// ============================================================================

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  // Add other stacks here (e.g., ParkingLotDetails, etc.)
  ParkingLotDetails: { parkingLotId: number };
  CreateReservation: { parkingLotId: number; spotId: number };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// ============================================================================
// Navigation Props Helper
// ============================================================================

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
