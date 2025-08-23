import { store } from '../../stores/store';
import { setCredentials, clearSession } from '../../features/auth/slice/authSlice';
import { appStorage } from '../utils/storage';
import { logger } from '../utils/logger';
import { isTokenExpired } from '../utils/jwt';
import type { RefreshTokenResponse, ApiResponse } from '../types';
import { config } from '../config/env';

interface AuthServiceConfig {
  baseUrl: string;
  onAuthFailure?: () => void;
  navigateToLogin?: () => void;
}

class AuthService {
  private config: AuthServiceConfig;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(config: AuthServiceConfig) {
    this.config = config;
  }

  /**
   * Get current access token, refreshing if expired
   */
  async getValidAccessToken(): Promise<string | null> {
    const state = store.getState();
    const { accessToken, refreshToken } = state.auth;

    if (!accessToken || !refreshToken) {
      logger.debug('No tokens available');
      return null;
    }

    // If token is not expired, return it
    if (!isTokenExpired(accessToken)) {
      return accessToken;
    }

    logger.info('Access token expired, attempting refresh');

    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      logger.debug('Refresh already in progress, waiting...');
      return this.refreshPromise;
    }

    // Start new refresh operation
    this.refreshPromise = this.performTokenRefresh(refreshToken);
    
    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(refreshToken: string): Promise<string | null> {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    try {
      logger.debug('Executing token refresh request', { requestId });

      const response = await fetch(`${this.config.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const refreshTime = Date.now() - startTime;

      if (!response.ok) {
        logger.warn('Token refresh failed with HTTP error', {
          requestId,
          status: response.status,
          refreshTime,
        });
        throw new Error(`HTTP ${response.status}`);
      }

      const result: ApiResponse<RefreshTokenResponse> = await response.json();

      if (!result.success || !result.data) {
        logger.warn('Token refresh response indicates failure', {
          requestId,
          refreshTime,
          responseSuccess: result.success,
        });
        throw new Error('Refresh response indicates failure');
      }

      // Update tokens in store and storage
      store.dispatch(setCredentials({
        accessToken: result.data.token,
        refreshToken: result.data.refreshToken,
      }));

      logger.authEvent('Token refresh successful', {
        requestId,
        refreshTime,
      });

      return result.data.token;

    } catch (error) {
      const refreshTime = Date.now() - startTime;
      
      logger.error('Token refresh failed', {
        requestId,
        refreshTime,
        error: error instanceof Error ? error.message : String(error),
      });

      // Clear session and redirect to login
      this.handleAuthFailure();
      return null;
    }
  }

  /**
   * Handle authentication failure
   */
  private handleAuthFailure(): void {
    logger.authEvent('Authentication failure, clearing session');
    
    // Clear Redux state
    store.dispatch(clearSession());
    
    // Call custom auth failure handler if provided
    this.config.onAuthFailure?.();
    
    // Navigate to login
    this.navigateToLogin();
  }

  /**
   * Navigate to login page
   */
  private navigateToLogin(): void {
    if (this.config.navigateToLogin) {
      this.config.navigateToLogin();
    } else {
      // Fallback to window.location
      window.location.href = '/login';
    }
  }

  /**
   * Clear all authentication data
   */
  logout(): void {
    logger.authEvent('User logout initiated');
    store.dispatch(clearSession());
    this.navigateToLogin();
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    const state = store.getState();
    return state.auth.isAuthenticated && !!state.auth.accessToken;
  }

  /**
   * Get current user from state
   */
  getCurrentUser() {
    const state = store.getState();
    return state.auth.user;
  }
}

// Create singleton instance
export const authService = new AuthService({
  baseUrl: config.apiBaseUrl,
  onAuthFailure: () => {
    // Custom auth failure handling can be added here
    logger.authEvent('Auth service handling authentication failure');
  },
});

export default authService;
