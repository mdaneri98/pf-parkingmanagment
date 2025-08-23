import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '@shared/types';
import type { UserResponse } from '../types';
import { smartBaseQuery } from '@shared/api/baseQuery';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: smartBaseQuery,
  endpoints: (builder) => ({
    getUserByEmail: builder.query<ApiResponse<UserResponse>, string>({
      query: (email) => ({ url: `/users/email/${encodeURIComponent(email)}` }),
    }),
  }),
});

export const { useGetUserByEmailQuery, useLazyGetUserByEmailQuery } = usersApi;


