import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '../../../shared/types';
import type { UserResponse } from '../../parking/types';
import type { RootState } from '../../../stores/store';
import { config } from '../../../shared/config/env';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserByEmail: builder.query<ApiResponse<UserResponse>, string>({
      query: (email) => ({ url: `/users/email/${encodeURIComponent(email)}` }),
    }),
  }),
});

export const { useGetUserByEmailQuery, useLazyGetUserByEmailQuery } = usersApi;


