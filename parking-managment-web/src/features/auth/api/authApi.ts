import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, LoginRequest, LoginResponse, RefreshTokenResponse, RegisterResponse } from '@shared/types';
import { smartBaseQuery, baseQuery } from '@shared/api/baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: smartBaseQuery,
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


