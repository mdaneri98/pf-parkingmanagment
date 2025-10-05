import { createApi } from '@reduxjs/toolkit/query/react';
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenResponse, 
  RegisterResponse, 
  User 
} from '@shared/types';
import { smartBaseQuery } from '@shared/api/baseQuery';

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  manager?: boolean;
}

interface PasswordRecoveryRequest {
  email: string;
}

interface VerifyRecoveryTokenRequest {
  token: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface LogoutRequest {
  refreshToken: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: smartBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation<ApiResponse<RegisterResponse>, RegisterRequest>({
      query: ({ manager = true, ...body }) => ({
        url: `/auth/register?manager=${manager}`,
        method: 'POST',
        body,
      }),
    }),
    
    refresh: builder.mutation<ApiResponse<RefreshTokenResponse>, RefreshTokenRequest>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    
    logout: builder.mutation<ApiResponse<null>, LogoutRequest>({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    
    requestPasswordRecovery: builder.mutation<ApiResponse<void>, PasswordRecoveryRequest>({
      query: (body) => ({
        url: '/auth/password-recovery/request',
        method: 'POST',
        body,
      }),
    }),
    
    verifyRecoveryToken: builder.mutation<ApiResponse<{ valid: boolean }>, VerifyRecoveryTokenRequest>({
      query: (body) => ({
        url: '/auth/password-recovery/verify',
        method: 'POST',
        body,
      }),
    }),
    
    resetPassword: builder.mutation<ApiResponse<{ done: boolean }>, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/password-recovery/reset',
        method: 'POST',
        body,
      }),
    }),
    
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: '/users/me',
      }),
      providesTags: ['User'],
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
  useGetCurrentUserQuery,
} = authApi;


