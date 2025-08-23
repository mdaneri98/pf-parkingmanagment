import { store } from '@stores/store';
import { setCredentials, clearSession } from '../../features/auth/slice/authSlice';
import { logger } from '../utils/logger';
import { isTokenExpired } from '../utils/jwt';
import type { RefreshTokenResponse, ApiResponse } from '../types';
import { config } from '../config/env';

interface AuthServiceConfig {
  baseUrl: string;
  onAuthFailure?: () => void;
}

/**
 * Clean AuthService focused solely on token management and authentication state
 * 
 * Responsibilities:
 * - Token lifecycle management (validation, refresh, expiry)
 * - Authentication state checking
 * - Session clearing
 * - Token storage coordination
 * 
 * NOT responsible for:
 * - User data fetching (handled by authApi RTK Query)
 * - Navigation (handled by router/components)
 * - Direct Redux dispatching from external calls
 */
class AuthService {
  private config: AuthServiceConfig;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(config: AuthServiceConfig) {
    this.config = config;
  }

  /**
   * Get current access token, refreshing if expired
   * This is the main method used by API interceptors
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
   * Manually refresh the access token
   * Returns true if successful, false otherwise
   */
  async refreshToken(): Promise<boolean> {
    const state = store.getState();
    const { refreshToken } = state.auth;

    if (!refreshToken) {
      logger.debug('No refresh token available');
      return false;
    }

    try {
      const newToken = await this.performTokenRefresh(refreshToken);
      return newToken !== null;
    } catch (error) {
      logger.error('Manual token refresh failed', { error });
      return false;
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    const state = store.getState();
    const { accessToken, refreshToken, isAuthenticated } = state.auth;
    
    // Must have tokens and be marked as authenticated
    return isAuthenticated && !!accessToken && !!refreshToken;
  }

  /**
   * Get current user from state
   */
  getCurrentUser() {
    const state = store.getState();
    return state.auth.user;
  }

  /**
   * Clear all authentication data and tokens
   */
  clearTokens(): void {
    logger.debug('Clearing all authentication tokens');
    store.dispatch(clearSession());
  }

  /**
   * Complete logout - clear session and trigger auth failure callback
   */
  logout(): void {
    logger.authEvent('User logout initiated');
    this.clearTokens();
    this.config.onAuthFailure?.();
  }

  /**
   * Get current tokens from state (for external usage if needed)
   */
  getCurrentTokens(): { accessToken: string | null; refreshToken: string | null } {
    const state = store.getState();
    return {
      accessToken: state.auth.accessToken,
      refreshToken: state.auth.refreshToken,
    };
  }

  /**
   * Check if access token is expired without refreshing
   */
  isAccessTokenExpired(): boolean {
    const state = store.getState();
    const { accessToken } = state.auth;
    
    if (!accessToken) {
      return true;
    }
    
    return isTokenExpired(accessToken);
  }

  // Private methods

  /**
   * Perform the actual token refresh operation
   * This is the core token refresh logic, isolated and focused
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

      // Update tokens in store
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

      // Clear session on refresh failure
      this.handleAuthFailure();
      return null;
    }
  }

  /**
   * Handle authentication failure by clearing session and triggering callback
   */
  private handleAuthFailure(): void {
    logger.authEvent('Authentication failure, clearing session');
    this.clearTokens();
    this.config.onAuthFailure?.();
  }
}

// Create singleton instance
export const authService = new AuthService({
  baseUrl: config.apiBaseUrl,
  onAuthFailure: () => {
    // Custom auth failure handling can be added here
    // Navigation should be handled by the component/router that receives this callback
    logger.authEvent('Auth service handling authentication failure');
  },
});

export default authService;