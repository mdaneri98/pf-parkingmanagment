import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '@shared/types';
import type {
  WalkInStayResponse,
  WalkInStayRequest,
  ReservationStatus,
} from '../types';
import { smartBaseQuery } from '@shared/api/baseQuery';

interface CreateWalkInStayParams {
  body: WalkInStayRequest;
  parkingLotId: number;
}

interface UpdateWalkInStayStatusParams {
  id: number;
  status: ReservationStatus;
}

interface ExtendWalkInStayParams {
  id: number;
  extraHours: number;
}

interface GetWalkInStaysByParkingLotParams {
  parkingLotId: number;
}

const transformWalkInStayError = (response: any) => {
  const errorMap: Record<number, { message: string; code: string }> = {
    400: { 
      message: 'Invalid walk-in stay data provided', 
      code: 'VALIDATION_ERROR' 
    },
    403: { 
      message: 'Not authorized to manage this walk-in stay', 
      code: 'UNAUTHORIZED' 
    },
    404: { 
      message: 'Walk-in stay not found', 
      code: 'NOT_FOUND' 
    },
    409: { 
      message: 'Spot is already occupied', 
      code: 'SPOT_OCCUPIED' 
    },
  };

  const error = errorMap[response.status];
  return error ? { ...error, status: response.status } : response;
};

export const walkInStayApi = createApi({
  reducerPath: 'walkInStayApi',
  baseQuery: smartBaseQuery,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['WalkInStay', 'ParkingLotWalkInStays', 'SpotWalkInStay', 'Spots'],
  endpoints: (builder) => ({
    createWalkInStay: builder.mutation<ApiResponse<WalkInStayResponse>, CreateWalkInStayParams>({
      query: ({ body }) => ({
        url: '/reservations/walk-in',
        method: 'POST',
        body,
      }),
      transformErrorResponse: transformWalkInStayError,
      invalidatesTags: (_result, _error, { parkingLotId, body }) => [
        { type: 'ParkingLotWalkInStays', id: parkingLotId },
        { type: 'SpotWalkInStay', id: body.spotId },
        { type: 'WalkInStay', id: 'LIST' },
        // Invalidate Spots tags to update availability
        // These will trigger refetch of spots in parkingApi
        { type: 'Spots', id: parkingLotId },
        { type: 'Spots', id: body.spotId },
        { type: 'Spots', id: 'LIST' },
      ],
    }),

    getWalkInStayById: builder.query<ApiResponse<WalkInStayResponse>, number>({
      query: (id) => ({
        url: `/reservations/walk-in/${id}`,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: 'WalkInStay', id: result.data.id },
              { type: 'WalkInStay', id: 'LIST' },
            ]
          : [{ type: 'WalkInStay', id: 'LIST' }],
    }),

    getWalkInStaysByParkingLot: builder.query<ApiResponse<WalkInStayResponse[]>, GetWalkInStaysByParkingLotParams>({
      query: ({ parkingLotId }) => ({
        url: `/reservations/walk-in/parking-lot/${parkingLotId}`,
      }),
      providesTags: (result, _error, { parkingLotId }) =>
        result?.data
          ? [
              ...result.data.map((stay) => ({ type: 'WalkInStay' as const, id: stay.id })),
              { type: 'ParkingLotWalkInStays' as const, id: parkingLotId },
              { type: 'WalkInStay' as const, id: 'LIST' },
            ]
          : [
              { type: 'ParkingLotWalkInStays' as const, id: parkingLotId },
              { type: 'WalkInStay' as const, id: 'LIST' },
            ],
    }),

    updateWalkInStayStatus: builder.mutation<ApiResponse<WalkInStayResponse>, UpdateWalkInStayStatusParams>({
      query: ({ id, status }) => ({
        url: `/reservations/walk-in/${id}/status?status=${status}`,
        method: 'PATCH',
      }),
      transformErrorResponse: transformWalkInStayError,
      invalidatesTags: (result, _error, { id }) => {
        const tags: any[] = [
          { type: 'WalkInStay', id },
          { type: 'WalkInStay', id: 'LIST' },
          { type: 'ParkingLotWalkInStays', id: result?.data?.spotId },
        ];
        
        // If status is COMPLETED, invalidate Spots to update availability
        if (result?.data) {
          tags.push(
            { type: 'SpotWalkInStay', id: result.data.spotId },
            { type: 'Spots', id: result.data.spotId },
            { type: 'Spots', id: 'LIST' },
          );
        }
        
        return tags;
      },
    }),

    extendWalkInStay: builder.mutation<ApiResponse<WalkInStayResponse>, ExtendWalkInStayParams>({
      query: ({ id, extraHours }) => ({
        url: `/reservations/walk-in/${id}/extend?extraHours=${extraHours}`,
        method: 'PATCH',
      }),
      transformErrorResponse: transformWalkInStayError,
      invalidatesTags: (result, _error, { id }) => [
        { type: 'WalkInStay', id },
        { type: 'WalkInStay', id: 'LIST' },
      ],
    }),

    getRemainingTime: builder.query<string, number>({
      query: (id) => ({
        url: `/reservations/walk-in/${id}/remaining-time`,
      }),
      transformResponse: (response: ApiResponse<string>) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useCreateWalkInStayMutation,
  useGetWalkInStayByIdQuery,
  useGetWalkInStaysByParkingLotQuery,
  useUpdateWalkInStayStatusMutation,
  useExtendWalkInStayMutation,
  useGetRemainingTimeQuery,
} = walkInStayApi;

