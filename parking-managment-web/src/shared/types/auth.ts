export type UserRole = 'user' | 'manager' | 'admin';

// Base user interface - unified across the application
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth-specific user type (extends base User)
export interface AuthUser extends User {
  // Add any auth-specific fields here if needed
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // Add missing field from slice
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  refreshToken: string;
}

export interface RegisterResponse {
  email: string;
}

export interface RefreshTokenResponse {
  token: string;
  email: string;
  refreshToken: string;
}
