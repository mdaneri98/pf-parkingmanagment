import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../stores/store';
import type { ApiResponse, RefreshTokenResponse } from '../types';
import { setCredentials, clearSession } from '../../features/auth/slice/authSlice';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { isTokenExpired } from '../utils/jwt';

export const baseQuery = fetchBaseQuery({
  baseUrl: config.apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
      logger.debug('Authorization header set', { 
        hasToken: !!token, 
        tokenLength: token.length 
      });
    } else {
      logger.debug('No access token available for request');
    }
    
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  logger.debug('Executing refresh token request', { requestId });
  
  try {
    const refreshResult = await baseQuery(args, api, extraOptions);
    const refreshTime = Date.now() - startTime;

    if (refreshResult.data) {
      const refreshResponse = refreshResult.data as ApiResponse<RefreshTokenResponse>;
      if (refreshResponse.success && refreshResponse.data) {
        logger.tokenRefresh(1, true, {
          requestId,
          refreshTime,
          hasNewToken: !!refreshResponse.data.token,
          hasNewRefreshToken: !!refreshResponse.data.refreshToken,
        });

        // Store the new tokens
        api.dispatch(setCredentials({
          accessToken: refreshResponse.data.token,
          refreshToken: refreshResponse.data.refreshToken,
        }));
        
        logger.authEvent('Token refresh successful', {
          requestId,
          refreshTime,
        });

        return refreshResult;
      } else {
        logger.warn('Token refresh response indicates failure', {
          requestId,
          refreshTime,
          responseSuccess: refreshResponse.success,
        });
      }
    }
    
    // Refresh failed
    logger.authEvent('Token refresh failed, clearing session', {
      requestId,
      refreshTime: Date.now() - startTime,
      reason: 'refresh_response_failure',
    });

    api.dispatch(clearSession());
    window.location.href = '/login';
    return refreshResult;
    
  } catch (error) {
    // Refresh failed with exception
    logger.error('Token refresh request failed with exception', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
    });

    api.dispatch(clearSession());
    window.location.href = '/login';
    throw error;
  }
};

// Smart base query that checks JWT expiration and handles refresh + retry logic
export const smartBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  const state = api.getState() as RootState;
  const { accessToken, refreshToken } = state.auth;
  
  // If we have an access token, check if it's expired
  if (accessToken && isTokenExpired(accessToken)) {
    logger.info('JWT token expired, attempting refresh before request', { requestId });
    
    if (!refreshToken) {
      logger.warn('No refresh token available, clearing session', { requestId });
      api.dispatch(clearSession());
      window.location.href = '/login';
      return { error: { status: 401, data: 'No refresh token available' } as FetchBaseQueryError };
    }
    
    try {
      // Use the refresh-specific query to get new tokens
      const refreshResult = await baseQueryWithReauth(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );
      
      if (refreshResult.error) {
        logger.warn('Token refresh failed, request cannot proceed', { requestId });
        return refreshResult;
      }
      
      logger.info('Token refreshed successfully, proceeding with original request', { requestId });
    } catch (error) {
      logger.error('Token refresh threw exception', { requestId, error });
      return { error: { status: 401, data: 'Token refresh failed' } as FetchBaseQueryError };
    }
  }
  
  // Execute the original request with valid token
  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : (args.method || 'GET');
  
  logger.apiRequest(method, url, {
    requestId,
    hasExtraOptions: !!extraOptions,
    timestamp: new Date().toISOString(),
  });
  
  const result = await baseQuery(args, api, extraOptions);
  const responseTime = Date.now() - startTime;
  
  // Log the response
  if (result.error) {
    logger.apiError(result.error, url, {
      requestId,
      responseTime,
      status: result.error.status,
      errorData: result.error.data,
    });
  } else {
    logger.apiResponse(200, url, responseTime, {
      requestId,
      hasData: !!result.data,
      dataType: result.data ? typeof result.data : 'undefined',
    });
  }
  
  // Log performance metrics
  logger.performance(`API Request: ${method} ${url}`, responseTime, {
    requestId,
    url,
    method,
    hasError: !!result.error,
    status: result.error?.status || 200,
  });
  
  return result;
};
