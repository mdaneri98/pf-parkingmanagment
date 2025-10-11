import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { config } from '@shared/config/env';
import { logger } from '@shared/utils/logger';
import { authInitializationService } from '@auth/services/authInitializationService';

export const baseQuery = fetchBaseQuery({
  baseUrl: config.apiBaseUrl,
  prepareHeaders: async (headers) => {
    const token = await authInitializationService.getValidAccessToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
      logger.debug('Authorization header set with valid token');
    } else {
      logger.debug('No valid access token available for request');
    }
    return headers;
  },
});

export const smartBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const requestId = Math.random().toString(36).substring(7);

  try {
    // Extract URL and method for logging
    const url = typeof args === 'string' ? args : args.url;
    const method = typeof args === 'string' ? 'GET' : (args.method || 'GET');
    const params = typeof args === 'object' && 'params' in args ? args.params : undefined;

    logger.apiRequest(method, url, {
      requestId,
      params,
      hasExtraOptions: !!extraOptions,
      timestamp: new Date().toISOString(),
    });

    console.log(`[${requestId}] Making API request to:`, { url, method, params });

    const result = await baseQuery(args, api, extraOptions);

    console.log(`[${requestId}] API response:`, {
      status: result.meta?.response?.status,
      data: result.data,
      error: result.error
    });

    if (result.error) {
      console.error(`[${requestId}] API Error:`, {
        status: result.error.status,
        data: result.error.data,
        originalStatus: result.error.originalStatus
      });
    }

    return result;
  } catch (error) {
    console.error('Error in smartBaseQuery:', error);
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: 'An unexpected error occurred',
        data: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};