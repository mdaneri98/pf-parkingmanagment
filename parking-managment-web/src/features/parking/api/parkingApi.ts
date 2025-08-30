import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, PaginatedResponse } from '@shared/types';
import type {
  ParkingLotResponse,
  SpotDTO,
  SpotFilters,
  CreateParkingLotRequest,
  UpdateParkingLotRequest,
  CreateSpotRequest,
  UpdateSpotRequest,
} from '../types';
import { smartBaseQuery } from '@shared/api/baseQuery';

export const parkingApi = createApi({
  reducerPath: 'parkingApi',
  baseQuery: smartBaseQuery,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['ParkingLot', 'UserParkingLots', 'Spots'],
  endpoints: (builder) => ({
    // ========== Parking Lot Queries ==========
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

    getParkingLotsByUserId: builder.query<ApiResponse<ParkingLotResponse[]>, number>({
      query: (userId) => ({ url: `/parking-lots/user/${userId}` }),
      providesTags: (result, _error, userId) =>
        result?.data
          ? [
              ...result.data.map((lot) => ({ type: 'ParkingLot' as const, id: lot.id })),
              { type: 'UserParkingLots' as const, id: userId },
            ]
          : [{ type: 'UserParkingLots' as const, id: userId }],
    }),

    getParkingLotById: builder.query<ApiResponse<ParkingLotResponse>, number>({
      query: (id) => ({ url: `/parking-lots/${id}` }),
      providesTags: (result) =>
        result
          ? [
              { type: 'ParkingLot' as const, id: result.data.id },
              { type: 'ParkingLot' as const, id: 'LIST' },
            ]
          : [{ type: 'ParkingLot' as const, id: 'LIST' }],
    }),

    // ========== Parking Lot Mutations ==========
    createParkingLot: builder.mutation<ApiResponse<ParkingLotResponse>, CreateParkingLotRequest>({
      query: (body) => ({
        url: '/parking-lots',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'ParkingLot', id: 'LIST' },
        { type: 'UserParkingLots', id: 'LIST' },
      ],
    }),

    updateParkingLot: builder.mutation<
      ApiResponse<ParkingLotResponse>,
      { id: number; body: UpdateParkingLotRequest }
    >({
      query: ({ id, body }) => ({
        url: `/parking-lots/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, _error, { id }) => [
        { type: 'ParkingLot', id },
        { type: 'ParkingLot', id: 'LIST' },
      ],
    }),

    deleteParkingLot: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/parking-lots/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _error, id) => [
        { type: 'ParkingLot', id },
        { type: 'ParkingLot', id: 'LIST' },
        { type: 'Spots', id: id }, // invalidate spots for this lot
        { type: 'Spots', id: 'LIST' },
      ],
    }),

    // ========== Spot Queries ==========
    getSpotsByParkingLotId: builder.query<
      ApiResponse<PaginatedResponse<SpotDTO>>,
      { parkingLotId: number } & SpotFilters
    >({
      query: ({ parkingLotId, available, vehicleType, floor, page, size, sort }) => {
        const params = new URLSearchParams();

        if (available !== undefined) params.append('available', available.toString());
        if (vehicleType) params.append('vehicleType', vehicleType);
        if (floor !== undefined) params.append('floor', floor.toString());
        if (page !== undefined) params.append('page', page.toString());
        if (size !== undefined) params.append('size', size.toString());
        if (sort) params.append('sort', sort);

        const queryString = params.toString();
        return {
          url: `/parking-lots/${parkingLotId}/spots${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result, _error, { parkingLotId }) =>
        result
          ? [
              { type: 'Spots' as const, id: 'LIST' },
              { type: 'Spots' as const, id: parkingLotId },
            ]
          : [{ type: 'Spots' as const, id: 'LIST' }],
    }),

    getSpotById: builder.query<ApiResponse<SpotDTO>, number>({
      query: (id) => ({ url: `/spots/${id}` }),
      providesTags: (result) =>
        result
          ? [
              { type: 'Spots' as const, id: result.data.id },
              { type: 'Spots' as const, id: 'LIST' },
            ]
          : [{ type: 'Spots' as const, id: 'LIST' }],
    }),

    // ========== Spot Mutations ==========
    createSpot: builder.mutation<ApiResponse<SpotDTO>, CreateSpotRequest>({
      query: (body) => ({
        url: '/spots',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, _error, { parkingLotId }) => [
        { type: 'Spots', id: 'LIST' },
        { type: 'Spots', id: parkingLotId },
      ],
    }),

    updateSpot: builder.mutation<
      ApiResponse<SpotDTO>,
      { id: number; body: UpdateSpotRequest }
    >({
      query: ({ id, body }) => ({
        url: `/spots/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, _error, { id, body }) => {
        const tags = [
          { type: 'Spots' as const, id },
          { type: 'Spots' as const, id: 'LIST' },
        ];
        if (body.parkingLotId) tags.push({ type: 'Spots' as const, id: body.parkingLotId });
        return tags;
      },
    }),

    deleteSpot: builder.mutation<ApiResponse<void>, { id: number; parkingLotId?: number }>({
      query: ({ id }) => ({
        url: `/spots/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _error, { id, parkingLotId }) => {
        const tags = [
          { type: 'Spots' as const, id },
          { type: 'Spots' as const, id: 'LIST' },
        ];
        if (parkingLotId) tags.push({ type: 'Spots' as const, id: parkingLotId });
        return tags;
      },
    }),
  }),
});

export const {
  // Parking Lot Queries
  useGetParkingLotsQuery,
  useGetParkingLotsByUserIdQuery,
  useGetParkingLotByIdQuery,

  // Parking Lot Mutations
  useCreateParkingLotMutation,
  useUpdateParkingLotMutation,
  useDeleteParkingLotMutation,

  // Spot Queries
  useGetSpotsByParkingLotIdQuery,
  useGetSpotByIdQuery,

  // Spot Mutations
  useCreateSpotMutation,
  useUpdateSpotMutation,
  useDeleteSpotMutation,
} = parkingApi;
