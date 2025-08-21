import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, LoginRequest, LoginResponse, RefreshTokenResponse, RegisterResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    register: builder.mutation<ApiResponse<RegisterResponse>, { firstName: string; lastName: string; email: string; password: string;}>({
      query: (body) => ({ url: '/auth/register?manager=true', method: 'POST', body }),
    }),
    refresh: builder.mutation<ApiResponse<RefreshTokenResponse>, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/refresh', method: 'POST', body }),
    }),
    logout: builder.mutation<ApiResponse<null>, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/logout', method: 'POST', body }),
    }),
    requestPasswordRecovery: builder.mutation<ApiResponse<unknown>, { email: string }>({
      query: (body) => ({ url: '/auth/password-recovery/request', method: 'POST', body }),
    }),
    verifyRecoveryToken: builder.mutation<ApiResponse<{ valid: boolean }>, { token: string }>({
      query: (body) => ({ url: '/auth/password-recovery/verify', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<ApiResponse<{ done: boolean }>, { token: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/password-recovery/reset', method: 'POST', body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useRequestPasswordRecoveryMutation,
  useVerifyRecoveryTokenMutation,
  useResetPasswordMutation,
} = authApi;


