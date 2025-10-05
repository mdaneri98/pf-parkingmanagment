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

  // Extract URL and method for logging
  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : (args.method || 'GET');

  logger.apiRequest(method, url, {
    requestId,
    hasExtraOptions: !!extraOptions,
    timestamp: new Date().toISOString(),
  });

  const result = await baseQuery(args, api, extraOptions);

  return result;
};