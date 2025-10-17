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
} from '@parking/types';
import { smartBaseQuery } from '@shared/api/baseQuery';

interface GetSpotsByParkingLotIdParams extends SpotFilters {
  parkingLotId: number;
}

interface CreateSpotParams {
  parkingLotId: number;
  body: CreateSpotRequest;
}

interface UpdateParkingLotParams {
  id: number;
  body: UpdateParkingLotRequest;
}

interface UpdateSpotParams {
  spotId: number;
  parkingLotId: number;
  body: Omit<UpdateSpotRequest, 'parkingLotId'>;
}

interface DeleteSpotParams {
  spotId: number;
  parkingLotId: number;
}

const buildQueryParams = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
};

export const parkingApi = createApi({
  reducerPath: 'parkingApi',
  baseQuery: smartBaseQuery,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['ParkingLot', 'UserParkingLots', 'Spots', 'WalkInStay', 'ParkingLotWalkInStays', 'SpotWalkInStay'],
  endpoints: (builder) => ({
    getParkingLots: builder.query<ApiResponse<ParkingLotResponse[]>, void>({
      query: () => ({
        url: '/parking-lots',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((lot) => ({ type: 'ParkingLot' as const, id: lot.id })),
              { type: 'ParkingLot' as const, id: 'LIST' },
            ]
          : [{ type: 'ParkingLot' as const, id: 'LIST' }],
    }),

    getParkingLotsByUserId: builder.query<ApiResponse<ParkingLotResponse[]>, number>({
      query: (userId) => ({
        url: `/parking-lots/user/${userId}`,
      }),
      providesTags: (result, _error, userId) =>
        result?.data
          ? [
              ...result.data.map((lot) => ({ type: 'ParkingLot' as const, id: lot.id })),
              { type: 'UserParkingLots' as const, id: userId },
            ]
          : [{ type: 'UserParkingLots' as const, id: userId }],
    }),

    getParkingLotById: builder.query<ApiResponse<ParkingLotResponse>, number>({
      query: (id) => ({
        url: `/parking-lots/${id}`,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: 'ParkingLot' as const, id: result.data.id },
              { type: 'ParkingLot' as const, id: 'LIST' },
            ]
          : [{ type: 'ParkingLot' as const, id: 'LIST' }],
    }),

    createParkingLot: builder.mutation<ApiResponse<ParkingLotResponse>, CreateParkingLotRequest>({
      query: (body) => ({
        url: '/parking-lots',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg, meta) => [
        { type: 'ParkingLot', id: 'LIST' },
        { type: 'UserParkingLots' },
      ],
    }),

    updateParkingLot: builder.mutation<ApiResponse<ParkingLotResponse>, UpdateParkingLotParams>({
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
        { type: 'Spots', id },
        { type: 'Spots', id: 'LIST' },
      ],
    }),

    getSpotsByParkingLotId: builder.query<ApiResponse<PaginatedResponse<SpotDTO>>, GetSpotsByParkingLotIdParams>({
      query: ({ parkingLotId, ...filters }) => {
        const queryString = buildQueryParams(filters);
        return {
          url: `/parking-lots/${parkingLotId}/spots${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result, _error, { parkingLotId }) =>
        result?.data
          ? [
              { type: 'Spots' as const, id: 'LIST' },
              { type: 'Spots' as const, id: parkingLotId },
            ]
          : [{ type: 'Spots' as const, id: 'LIST' }],
    }),

    getSpotById: builder.query<ApiResponse<SpotDTO>, number>({
      query: (id) => ({
        url: `/spots/${id}`,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: 'Spots' as const, id: result.data.id },
              { type: 'Spots' as const, id: 'LIST' },
            ]
          : [{ type: 'Spots' as const, id: 'LIST' }],
    }),

    createSpot: builder.mutation<ApiResponse<SpotDTO>, CreateSpotParams>({
      query: ({ parkingLotId, body }) => ({
        url: `/parking-lots/${parkingLotId}/spots`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, _error, { parkingLotId }) => [
        { type: 'Spots', id: parkingLotId },
        { type: 'Spots', id: 'LIST' },
      ],
    }),

    updateSpot: builder.mutation<ApiResponse<SpotDTO>, UpdateSpotParams>({
      query: ({ spotId, parkingLotId, body }) => ({
        url: `/parking-lots/${parkingLotId}/spots/${spotId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, _error, { spotId, parkingLotId }) => [
        { type: 'Spots', id: spotId },
        { type: 'Spots', id: 'LIST' },
        { type: 'Spots', id: parkingLotId },
      ],
    }),

    deleteSpot: builder.mutation<ApiResponse<void>, DeleteSpotParams>({
      query: ({ spotId, parkingLotId }) => ({
        url: `/parking-lots/${parkingLotId}/spots/${spotId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _error, { spotId, parkingLotId }) => [
        { type: 'Spots', id: spotId },
        { type: 'Spots', id: 'LIST' },
        { type: 'Spots', id: parkingLotId },
      ],
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
