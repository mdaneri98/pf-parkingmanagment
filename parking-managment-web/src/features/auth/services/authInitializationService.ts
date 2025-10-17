import { validateStoredTokens, extractUserRoles, isTokenExpired } from '@shared/utils/jwt';
import { appStorage } from '@shared/utils/storage';
import { logger } from '@shared/utils/logger';
import { config } from '@shared/config/env';
import type { AppDispatch } from '@stores/store';
import { store } from '@stores/store';
import { setCredentials, setInitialized, setUser, clearSession, setAuthError } from '@auth/slice/authSlice';
import { authApi } from '@auth/api/authApi';
import type { RefreshTokenResponse, ApiResponse } from '@shared/types';

/**
 * Result interface for authentication initialization
 */
export interface AuthInitializationResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export const authInitializationService = {
  /**
   * Initialize authentication state from stored tokens
   */
  async initializeFromStorage(dispatch: AppDispatch): Promise<AuthInitializationResult> {
    logger.debug('Starting auth initialization from stored tokens');
    
    try {
      const validation = validateStoredTokens();
      logger.debug('Token validation result', validation);

      if (validation.accessToken && validation.refreshToken) {
        logger.info('Found stored tokens, initializing authentication state');

        dispatch(setCredentials({
          accessToken: validation.accessToken,
          refreshToken: validation.refreshToken,
        }));

        // Fetch current user data to complete authentication state
        try {
          const userResponse = await dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap();
          if (userResponse.success && userResponse.data) {
            dispatch(setUser(userResponse.data));
            logger.debug('User data loaded during initialization');
          } else {
            logger.error('User data fetch returned unsuccessful response');
            this.handleUserFetchError('Failed to load user profile. Please try logging in again.');
            return { success: false };
          }
        } catch (userError) {
          logger.error('Failed to fetch user data during initialization', { error: userError });
          this.handleUserFetchError('Unable to load user profile. Please check your connection and try again.');
          return { success: false };
        }

        logger.info('Authentication initialization successful', {
          hasAccessToken: !!validation.accessToken,
          hasRefreshToken: !!validation.refreshToken,
        });

        return {
          success: true,
          accessToken: validation.accessToken,
          refreshToken: validation.refreshToken,
        };
      }

      logger.debug('No stored tokens found, skipping authentication initialization');
      return { success: false };
    } catch (error) {
      logger.error('Error during auth initialization', { error });
      return { success: false };
    } finally {
      dispatch(setInitialized(true));
    }
  },

  /**
   * Persist authentication credentials to localStorage
   * Extracts user roles from access token and stores them with tokens
   */
  persistCredentials(accessToken: string, refreshToken: string): void {
    try {
      const userRoles = extractUserRoles(accessToken);
      const selectedRole = userRoles.find(r => r.toLowerCase() === 'manager') || userRoles[0];
      appStorage.setAuth(accessToken, refreshToken, selectedRole);
    } catch (error) {
      logger.error('Error persisting credentials', { error });
    }
  },

  /**
   * Clear stored credentials from localStorage
   */
  clearStoredCredentials(): void {
    try {
      appStorage.clearAuth();
      appStorage.clearSelectedParkingLotId();
    } catch (error) {
      logger.error('Error clearing stored credentials', { error });
    }
  },

  /**
   * Get a valid access token, refreshing if necessary
   * This is the main method for API requests
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
    return this.refreshAccessToken();
  },

  /**
   * Refresh the access token using the refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    const state = store.getState();
    const { refreshToken } = state.auth;

    if (!refreshToken) {
      logger.debug('No refresh token available');
      this.handleAuthFailure();
      return null;
    }

    try {
      logger.debug('Executing token refresh request');

      const response = await fetch(`${config.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        logger.warn('Token refresh failed with HTTP error', { status: response.status });
        throw new Error(`HTTP ${response.status}`);
      }

      const result: ApiResponse<RefreshTokenResponse> = await response.json();

      if (!result.success || !result.data) {
        logger.warn('Token refresh response indicates failure');
        throw new Error('Refresh response indicates failure');
      }

      // Update tokens in Redux store
      store.dispatch(
        setCredentials({ 
          accessToken: result.data.token, 
          refreshToken: result.data.refreshToken 
        })
      );

      // Persist refreshed tokens to localStorage
      this.persistCredentials(result.data.token, result.data.refreshToken);

      logger.info('Token refresh successful');
      return result.data.token;
    } catch (error) {
      logger.error('Token refresh failed', { error });
      this.handleAuthFailure();
      return null;
    }
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    const state = store.getState();
    const { accessToken, refreshToken, isAuthenticated } = state.auth;
    return isAuthenticated && !!accessToken && !!refreshToken;
  },

  /**
   * Get current user from state
   */
  getCurrentUser() {
    const state = store.getState();
    return state.auth.user;
  },

  /**
   * Clear authentication session
   */
  clearSession(): void {
    logger.debug('Clearing authentication session');
    store.dispatch(clearSession());
    this.clearStoredCredentials();
  },

  /**
   * Handle authentication failure by clearing all auth data
   */
  handleAuthFailure(): void {
    logger.info('Authentication failure detected, clearing session');
    this.clearSession();
  },

  /**
   * Handle user data fetch errors by clearing auth state and setting error message
   */
  handleUserFetchError(errorMessage: string): void {
    logger.info('User data fetch failed, clearing auth state and setting error');
    this.clearStoredCredentials();
    store.dispatch(clearSession());
    store.dispatch(setAuthError(errorMessage));
  },
};
