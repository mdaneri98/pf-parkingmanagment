import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../stores/store';
import type { ApiResponse, RefreshTokenResponse } from '../types';
import { setCredentials, clearSession } from '../../features/auth/slice/authSlice';
import { config } from '../config/env';
import { logger } from '../utils/logger';

const baseQuery = fetchBaseQuery({
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

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  // Log the incoming request
  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : (args.method || 'GET');
  
  logger.apiRequest(method, url, {
    requestId,
    hasExtraOptions: !!extraOptions,
    timestamp: new Date().toISOString(),
  });

  // Proceed with the original request
  logger.debug('Executing base query', { requestId, url, method });
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

  // Handle 401 UNAUTHORIZED responses (JWT expired)
  if (result.error && result.error.status === 401) {
    logger.warn('Received 401 Unauthorized, attempting token refresh', {
      requestId,
      url,
      responseTime,
      errorDetails: result.error,
    });

    const state = api.getState() as RootState;
    const { refreshToken } = state.auth;
    
    // Try to refresh token if we have one
    if (refreshToken) {
      logger.info('Attempting token refresh', {
        requestId,
        hasRefreshToken: !!refreshToken,
        refreshTokenLength: refreshToken.length,
      });

      try {
        const refreshStartTime = Date.now();
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );
        const refreshTime = Date.now() - refreshStartTime;

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
            logger.authEvent('Storing new credentials after refresh', {
              requestId,
              newTokenLength: refreshResponse.data.token?.length,
              newRefreshTokenLength: refreshResponse.data.refreshToken?.length,
            });

            api.dispatch(setCredentials({
              accessToken: refreshResponse.data.token,
              refreshToken: refreshResponse.data.refreshToken,
            }));
            
            // Retry the original request with the new token
            logger.info('Retrying original request with new token', {
              requestId,
              url,
              method,
            });

            const retryStartTime = Date.now();
            const retryResult = await baseQuery(args, api, extraOptions);
            const retryTime = Date.now() - retryStartTime;

            if (retryResult.error) {
              logger.error('Retry request failed', {
                requestId,
                url,
                retryTime,
                error: retryResult.error,
              });
            } else {
              logger.info('Retry request successful', {
                requestId,
                url,
                retryTime,
                totalTime: responseTime + refreshTime + retryTime,
              });
            }

            return retryResult;
          } else {
            logger.warn('Token refresh response indicates failure', {
              requestId,
              refreshTime,
              responseSuccess: refreshResponse.success,
              responseData: !!refreshResponse.data,
            });
          }
        } else {
          logger.warn('Token refresh returned no data', {
            requestId,
            refreshTime,
            refreshError: refreshResult.error,
          });
        }
        
        // Refresh failed, clear session and redirect to login
        logger.authEvent('Token refresh failed, clearing session', {
          requestId,
          refreshTime,
          reason: 'refresh_response_failure',
        });

        api.dispatch(clearSession());
        window.location.href = '/login';
      } catch (error) {
        // Refresh failed, clear session and redirect to login
        logger.error('Token refresh request failed with exception', {
          requestId,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        logger.authEvent('Token refresh exception, clearing session', {
          requestId,
          reason: 'refresh_exception',
        });

        api.dispatch(clearSession());
        window.location.href = '/login';
      }
    } else {
      // No refresh token available, clear session and redirect to login
      logger.warn('No refresh token available for 401 response', {
        requestId,
        url,
        reason: 'no_refresh_token',
      });

      logger.authEvent('No refresh token, clearing session', {
        requestId,
        reason: 'no_refresh_token',
      });

      api.dispatch(clearSession());
      window.location.href = '/login';
    }
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
