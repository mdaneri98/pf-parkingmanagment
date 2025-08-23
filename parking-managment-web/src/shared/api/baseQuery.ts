import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../stores/store';
import type { ApiResponse, RefreshTokenResponse } from '../types';
import { setCredentials, clearSession } from '../../features/auth/slice/authSlice';
import { config } from '../config/env';

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Proceed with the original request
  const result = await baseQuery(args, api, extraOptions);

  // Handle 403 FORBIDDEN responses
  if (result.error && result.error.status === 403) {
    const state = api.getState() as RootState;
    const { refreshToken } = state.auth;
    
    // Try to refresh token if we have one
    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const refreshResponse = refreshResult.data as ApiResponse<RefreshTokenResponse>;
          if (refreshResponse.success && refreshResponse.data) {
            // Store the new tokens
            api.dispatch(setCredentials({
              accessToken: refreshResponse.data.token,
              refreshToken: refreshResponse.data.refreshToken,
            }));
            
            // Retry the original request with the new token
            return baseQuery(args, api, extraOptions);
          }
        }
        
        // Refresh failed, clear session and redirect to login
        api.dispatch(clearSession());
        window.location.href = '/login';
      } catch (error) {
        // Refresh failed, clear session and redirect to login
        api.dispatch(clearSession());
        window.location.href = '/login';
      }
    } else {
      // No refresh token available, clear session and redirect to login
      api.dispatch(clearSession());
      window.location.href = '/login';
    }
  }

  return result;
};
