import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '../../../shared/types';
import type { ParkingLotResponse } from '../types';
import type { RootState } from '../../../stores/store';
import { config } from '../../../shared/config/env';

export const parkingApi = createApi({
  reducerPath: 'parkingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['ParkingLot'],
  endpoints: (builder) => ({
    getParkingLots: builder.query<ApiResponse<ParkingLotResponse[]>, void>({
      query: () => ({ url: '/parking-lots' }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((lot) => ({ type: 'ParkingLot' as const, id: lot.id })),
              { type: 'ParkingLot' as const, id: 'LIST' },
            ]
          : [{ type: 'ParkingLot' as const, id: 'LIST' }],
    }),
    getParkingLotById: builder.query<ApiResponse<ParkingLotResponse>, number>({
      query: (id) => ({ url: `/parking-lots/${id}` }),
      providesTags: (result) => (result ? [{ type: 'ParkingLot', id: result.data.id }] : []),
    }),
  }),
});

export const { useGetParkingLotsQuery, useGetParkingLotByIdQuery } = parkingApi;


