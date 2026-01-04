/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import apiClient, { setAuthTokens, clearAuthTokens } from '@api/client';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from '@types';

// ============================================================================
// Authentication Service
// ============================================================================

class AuthService {
  /**
   * POST /auth/login
   * Authenticate user with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials,
    );

    const { accessToken, refreshToken, user, expiresIn } = response.data.data;

    // Store tokens
    await setAuthTokens(accessToken, refreshToken);

    return { accessToken, refreshToken, user, expiresIn };
  }

  /**
   * POST /auth/register
   * Register a new user account
   * @param isManager - Set to true for manager registration (default: false)
   */
  async register(
    data: RegisterRequest,
    isManager: boolean = false,
  ): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/register',
      data,
      {
        params: { manager: isManager },
      },
    );

    const { accessToken, refreshToken, user, expiresIn } = response.data.data;

    // Store tokens
    await setAuthTokens(accessToken, refreshToken);

    return { accessToken, refreshToken, user, expiresIn };
  }

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token
   */
  async refreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    const request: RefreshTokenRequest = { refreshToken };

    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      '/auth/refresh',
      request,
    );

    const { accessToken, refreshToken: newRefreshToken, expiresIn } =
      response.data.data;

    // Update stored tokens
    await setAuthTokens(accessToken, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken, expiresIn };
  }

  /**
   * POST /auth/logout
   * Logout user and invalidate refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      const request: RefreshTokenRequest = { refreshToken };

      await apiClient.post<ApiResponse<null>>('/auth/logout', request);
    } finally {
      // Clear tokens from storage regardless of API response
      await clearAuthTokens();
    }
  }

  /**
   * Clear authentication state
   * Used for force logout or when tokens are invalid
   */
  async clearAuth(): Promise<void> {
    await clearAuthTokens();
  }
}

// ============================================================================
// Export
// ============================================================================

export const authService = new AuthService();
export default authService;
