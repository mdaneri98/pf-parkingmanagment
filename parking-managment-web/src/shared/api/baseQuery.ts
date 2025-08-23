import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { authService } from '@services/authService';

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

  // Execute the request (baseQuery will handle token refresh through authService.getValidAccessToken)
  let result = await baseQuery(args, api, extraOptions);

  return result;
};