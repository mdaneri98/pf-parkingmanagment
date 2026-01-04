/**
 * Axios API Client Configuration
 * Handles authentication, request/response interceptors, and error handling
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Config from 'react-native-config';
import { storage } from '@services/storage';
import type { ApiErrorResponse } from '@types';

// ============================================================================
// Types
// ============================================================================

interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface QueuedRequest {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
}

// ============================================================================
// Constants
// ============================================================================

const API_BASE_URL = Config.API_URL || 'http://localhost:3000/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// ============================================================================
// Create Axios Instance
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ============================================================================
// Token Management
// ============================================================================

class TokenManager {
  private isRefreshing = false;
  private refreshQueue: QueuedRequest[] = [];

  async getAccessToken(): Promise<string | null> {
    return storage.getItem(ACCESS_TOKEN_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return storage.getItem(REFRESH_TOKEN_KEY);
  }

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      storage.setItem(ACCESS_TOKEN_KEY, accessToken),
      storage.setItem(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  }

  async clearTokens(): Promise<void> {
    await Promise.all([
      storage.removeItem(ACCESS_TOKEN_KEY),
      storage.removeItem(REFRESH_TOKEN_KEY),
    ]);
  }

  async refreshAccessToken(): Promise<TokenRefreshResponse | null> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await axios.post<{ data: TokenRefreshResponse }>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
      );

      const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.data;
      await this.setTokens(accessToken, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken, expiresIn };
    } catch (error) {
      await this.clearTokens();
      return null;
    }
  }

  async handleTokenRefresh(
    failedRequest: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse> {
    if (this.isRefreshing) {
      // Queue the request while token is being refreshed
      return new Promise((resolve, reject) => {
        this.refreshQueue.push({
          resolve,
          reject,
          config: failedRequest,
        });
      });
    }

    this.isRefreshing = true;

    try {
      const tokens = await this.refreshAccessToken();

      if (!tokens) {
        throw new Error('Failed to refresh token');
      }

      // Update the failed request with new token
      failedRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

      // Process queued requests
      this.refreshQueue.forEach(({ resolve, config }) => {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        resolve(apiClient(config));
      });

      this.refreshQueue = [];

      // Retry the original request
      return apiClient(failedRequest);
    } catch (error) {
      // Reject all queued requests
      this.refreshQueue.forEach(({ reject }) => {
        reject(error);
      });

      this.refreshQueue = [];
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }
}

const tokenManager = new TokenManager();

// ============================================================================
// Request Interceptor
// ============================================================================

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add access token to request if available
    const accessToken = await tokenManager.getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Log request in development
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  },
);

// ============================================================================
// Response Interceptor
// ============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (__DEV__) {
      console.log(`[API Response] ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log error in development
    if (__DEV__) {
      console.error('[API Response Error]', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        requestData: error.config?.data,
      });
    }

    // Handle 401 Unauthorized - Token expired
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        return await tokenManager.handleTokenRefresh(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - user needs to login again
        await tokenManager.clearTokens();
        // TODO: Navigate to login screen
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorResponse: ApiErrorResponse = error.response?.data || {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'An unexpected error occurred',
      },
    };

    return Promise.reject(errorResponse);
  },
);

// ============================================================================
// API Client Helper Functions
// ============================================================================

export const setAuthTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  await tokenManager.setTokens(accessToken, refreshToken);
};

export const clearAuthTokens = async (): Promise<void> => {
  await tokenManager.clearTokens();
};

export const getAccessToken = async (): Promise<string | null> => {
  return tokenManager.getAccessToken();
};

// ============================================================================
// Export
// ============================================================================

export default apiClient;
export { API_BASE_URL, tokenManager };
