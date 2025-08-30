
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
 * AuthService – focused on token lifecycle and auth state boundaries
 * - No login/register
 * - Provides a single getValidAccessToken entrypoint for interceptors
 */
class AuthService {
  private config: AuthServiceConfig;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(config: AuthServiceConfig) {
    this.config = config;
  }

  /**
   * Returns a valid access token, refreshing if necessary.
   */
  async getValidAccessToken(): Promise<string | null> {
    const state = store.getState();
    const { accessToken, refreshToken } = state.auth;

    if (!accessToken || !refreshToken) {
      logger.debug('No tokens available');
      return null;
    }

    if (!isTokenExpired(accessToken)) {
      return accessToken;
    }

    logger.info('Access token expired, attempting refresh');

    if (this.refreshPromise) {
      logger.debug('Refresh already in progress, waiting...');
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh(refreshToken);
    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Manual refresh entrypoint. Returns true on success.
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
   * Lightweight state check (does not refresh)
   */
  isAuthenticated(): boolean {
    const state = store.getState();
    const { accessToken, refreshToken, isAuthenticated } = state.auth;
    return isAuthenticated && !!accessToken && !!refreshToken;
  }

  getCurrentUser() {
    const state = store.getState();
    return state.auth.user;
  }

  clearTokens(): void {
    logger.debug('Clearing all authentication tokens');
    store.dispatch(clearSession());
  }

  logout(): void {
    logger.authEvent('User logout initiated');
    this.clearTokens();
    this.config.onAuthFailure?.();
  }

  getCurrentTokens(): { accessToken: string | null; refreshToken: string | null } {
    const state = store.getState();
    return { accessToken: state.auth.accessToken, refreshToken: state.auth.refreshToken };
  }

  isAccessTokenExpired(): boolean {
    const state = store.getState();
    const { accessToken } = state.auth;
    if (!accessToken) return true;
    return isTokenExpired(accessToken);
  }

  // --- private ---
  private async performTokenRefresh(refreshToken: string): Promise<string | null> {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    try {
      logger.debug('Executing token refresh request', { requestId });

      const response = await fetch(`${this.config.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const refreshTime = Date.now() - startTime;

      if (!response.ok) {
        logger.warn('Token refresh failed with HTTP error', { requestId, status: response.status, refreshTime });
        throw new Error(`HTTP ${response.status}`);
      }

      const result: ApiResponse<RefreshTokenResponse> = await response.json();

      if (!result.success || !result.data) {
        logger.warn('Token refresh response indicates failure', { requestId, refreshTime, responseSuccess: result.success });
        throw new Error('Refresh response indicates failure');
      }

      // Update tokens in store (single source of truth)
      store.dispatch(
        setCredentials({ accessToken: result.data.token, refreshToken: result.data.refreshToken })
      );

      logger.authEvent('Token refresh successful', { requestId, refreshTime });
      return result.data.token;
    } catch (error) {
      const refreshTime = Date.now() - startTime;
      logger.error('Token refresh failed', {
        requestId,
        refreshTime,
        error: error instanceof Error ? error.message : String(error),
      });
      this.handleAuthFailure();
      return null;
    }
  }

  private handleAuthFailure(): void {
    logger.authEvent('Authentication failure, clearing session');
    this.clearTokens();
    this.config.onAuthFailure?.();
  }
}

export const authService = new AuthService({
  baseUrl: config.apiBaseUrl,
  onAuthFailure: () => {
    // navigation or UI side-effects should be handled outside
    logger.authEvent('Auth service handling authentication failure');
  },
});

export default authService;
