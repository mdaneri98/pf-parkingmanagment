import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { authService } from '../services/authService';

export const baseQuery = fetchBaseQuery({
  baseUrl: config.apiBaseUrl,
  prepareHeaders: async (headers) => {
    const token = await authService.getValidAccessToken();
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
      logger.debug('Authorization header set with valid token');
    } else {
      logger.debug('No valid access token available for request');
    }
    
    return headers;
  },
});

// Enhanced base query with automatic token refresh and comprehensive logging
export const smartBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  // Extract URL and method for logging
  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : (args.method || 'GET');
  
  logger.apiRequest(method, url, {
    requestId,
    hasExtraOptions: !!extraOptions,
    timestamp: new Date().toISOString(),
  });
  
  // Execute the request (auth service handles token refresh automatically)
  const result = await baseQuery(args, api, extraOptions);
  const responseTime = Date.now() - startTime;
  
  // Handle authentication errors
  if (result.error?.status === 401) {
    logger.warn('Received 401 authentication error', {
      requestId,
      responseTime,
      url,
      method,
    });
    
    // Let auth service handle the failure
    authService.logout();
    return result;
  }
  
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
