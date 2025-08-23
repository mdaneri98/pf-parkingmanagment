import { store } from '../../stores/store';
import { setCredentials, clearSession, setUser } from '../../features/auth/slice/authSlice';
import { logger } from '../utils/logger';
import { isTokenExpired } from '../utils/jwt';
import type { RefreshTokenResponse, ApiResponse, User } from '../types';
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

      // Fetch and set user data after successful token refresh
      await this.fetchAndSetUser(result.data.token);

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
   * Fetch user data and update store
   */
  private async fetchAndSetUser(accessToken: string): Promise<void> {
    const requestId = Math.random().toString(36).substring(7);
    
    try {
      logger.debug('Fetching user data after token refresh', { requestId });

      const response = await fetch(`${this.config.baseUrl}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        logger.warn('Failed to fetch user data', {
          requestId,
          status: response.status,
        });
        return; // Don't throw error here, token refresh was successful
      }

      const result: ApiResponse<User> = await response.json();

      if (result.success && result.data) {
        store.dispatch(setUser(result.data));
        logger.debug('User data updated successfully', { requestId });
      } else {
        logger.warn('User data fetch response indicates failure', {
          requestId,
          responseSuccess: result.success,
        });
      }

    } catch (error) {
      logger.error('Exception while fetching user data', {
        requestId,
        error: error instanceof Error ? error.message : String(error),
      });
      // Don't throw error here, token refresh was successful
    }
  }

  /**
   * Fetch user data with current token
   */
  async fetchUser(): Promise<User | null> {
    const accessToken = await this.getValidAccessToken();
    
    if (!accessToken) {
      logger.debug('No valid token available for user fetch');
      return null;
    }

    const requestId = Math.random().toString(36).substring(7);

    try {
      logger.debug('Fetching current user data', { requestId });

      const response = await fetch(`${this.config.baseUrl}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        logger.warn('Failed to fetch user data', {
          requestId,
          status: response.status,
        });
        
        if (response.status === 401) {
          this.handleAuthFailure();
        }
        
        return null;
      }

      const result: ApiResponse<User> = await response.json();

      if (result.success && result.data) {
        store.dispatch(setUser(result.data));
        logger.debug('User data fetched and updated successfully', { requestId });
        return result.data;
      } else {
        logger.warn('User data fetch response indicates failure', {
          requestId,
          responseSuccess: result.success,
        });
        return null;
      }

    } catch (error) {
      logger.error('Exception while fetching user data', {
        requestId,
        error: error instanceof Error ? error.message : String(error),
      });
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