import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { config } from '@shared/config/env';
import { logger } from '@shared/utils/logger';
import { authInitializationService } from '@auth/services/authInitializationService';
import i18n from '@shared/i18n/config';

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
    
    const currentLanguage = i18n.language || 'en';
    headers.set('Accept-Language', currentLanguage);
    logger.debug(`Accept-Language header set to: ${currentLanguage}`);
    
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
    const body = typeof args === 'object' && 'body' in args ? args.body : undefined;
    const params = typeof args === 'object' && 'params' in args ? args.params : undefined;

    // HTTP Request Logging (only when enabled)
    if (config.enableHttpLogging) {
      console.group(`🌐 [${requestId}] HTTP ${method} ${url}`);
      console.log('📤 Request:', {
        method,
        url,
        body: body ? JSON.stringify(body, null, 2) : undefined,
        params,
        timestamp: new Date().toISOString(),
      });
      
      // Log headers if available
      const headers = typeof args === 'object' && 'headers' in args ? args.headers : undefined;
      if (headers) {
        console.log('📋 Headers:', headers);
      }
    }

    logger.apiRequest(method, url, {
      requestId,
      params,
      hasExtraOptions: !!extraOptions,
      timestamp: new Date().toISOString(),
    });

    const result = await baseQuery(args, api, extraOptions);

    // HTTP Response Logging (only when enabled)
    if (config.enableHttpLogging) {
      console.log('📥 Response:', {
        status: result.meta?.response?.status,
        statusText: result.meta?.response?.statusText,
        data: result.data,
        error: result.error,
        timestamp: new Date().toISOString(),
      });

      if (result.error) {
        console.error('❌ Error Details:', {
          status: result.error.status,
          data: result.error.data,
          originalStatus: 'originalStatus' in result.error ? result.error.originalStatus : undefined,
          error: 'error' in result.error ? result.error.error : undefined,
        });
      } else {
        console.log('✅ Success');
      }
      
      console.groupEnd();
    }

    return result;
  } catch (error) {
    if (config.enableHttpLogging) {
      console.error(`❌ [${requestId}] Unexpected error in smartBaseQuery:`, error);
    }
    
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: 'An unexpected error occurred',
        data: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};