export type UserRole = 'user' | 'manager' | 'admin';


export interface UserDetails {
  phone: string;
  address: string;
  lang?: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  userDetail: UserDetails;
}

export type AuthUser = User;

export interface AuthState {
  user: User | null;
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

export interface JWTPayload {
  sub: string;
  exp: number;
  iat: number;
  roles: string[];
}
