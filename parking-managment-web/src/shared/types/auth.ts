export type UserRole = 'user' | 'manager' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roleValidationError: string | null;
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
