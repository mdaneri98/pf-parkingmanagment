import { createApi } from '@reduxjs/toolkit/query/react';
import { smartBaseQuery } from '@shared/api/baseQuery';
import type { ApiResponse, PaginatedResponse } from '@shared/types';
import type {
  WalkInStayResponse,
  CreateWalkInStayRequest,
  ExtendTimeRequest,
  RemainingTimeResponse,
  WalkInStayFilters,
  WalkInStayStatus,
} from '../types';

interface GetWalkInStaysParams extends WalkInStayFilters {
  page?: number;
  size?: number;
}

interface GetWalkInStaysByParkingLotParams extends WalkInStayFilters {
  parkingLotId: number;
  page?: number;
  size?: number;
}

interface UpdateStatusParams {
  id: number;
  status: WalkInStayStatus;
}

interface ExtendTimeParams {
  id: number;
  extraHours: number;
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

const transformWalkInStayError = (response: any) => {
  const errorMap: Record<number, { message: string; code: string }> = {
    400: { 
      message: 'Invalid walk-in stay data provided', 
      code: 'VALIDATION_ERROR' 
    },
    403: { 
      message: 'Not authorized to manage walk-in stays', 
      code: 'UNAUTHORIZED' 
    },
    404: { 
      message: 'Walk-in stay not found', 
      code: 'NOT_FOUND' 
    },
    409: { 
      message: 'Spot is not available or already occupied', 
      code: 'SPOT_UNAVAILABLE' 
    },
  };

  const error = errorMap[response.status];
  return error ? { ...error, status: response.status } : response;
};

export const walkInStaysApi = createApi({
  reducerPath: 'walkInStaysApi',
  baseQuery: smartBaseQuery,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['WalkInStay', 'ParkingLotWalkIns'],
  endpoints: (builder) => ({
    // Create walk-in stay
    createWalkInStay: builder.mutation<ApiResponse<WalkInStayResponse>, CreateWalkInStayRequest>({
      query: (body) => ({
        url: '/reservations/walk-in',
        method: 'POST',
        body,
      }),
      transformErrorResponse: transformWalkInStayError,
      invalidatesTags: ['WalkInStay', 'ParkingLotWalkIns'],
    }),

    // Get walk-in stays with filters
    getWalkInStays: builder.query<ApiResponse<WalkInStayResponse[]>, GetWalkInStaysParams>({
      query: (params) => {
        const queryString = buildQueryParams(params);
        return {
          url: `/reservations/walk-in${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((stay) => ({ type: 'WalkInStay' as const, id: stay.id })),
              { type: 'WalkInStay' as const, id: 'LIST' },
            ]
          : [{ type: 'WalkInStay' as const, id: 'LIST' }],
    }),

    // Get walk-in stay by ID
    getWalkInStayById: builder.query<ApiResponse<WalkInStayResponse>, number>({
      query: (id) => ({
        url: `/reservations/walk-in/${id}`,
      }),
      providesTags: (result, _error, id) => [
        { type: 'WalkInStay' as const, id },
      ],
    }),

    // Get remaining time for a walk-in stay
    getRemainingTime: builder.query<ApiResponse<RemainingTimeResponse>, number>({
      query: (id) => ({
        url: `/reservations/walk-in/${id}/remaining-time`,
      }),
      providesTags: (result, _error, id) => [
        { type: 'WalkInStay' as const, id: `${id}-remaining-time` },
      ],
    }),

    // Update walk-in stay status
    updateWalkInStayStatus: builder.mutation<ApiResponse<WalkInStayResponse>, UpdateStatusParams>({
      query: ({ id, status }) => ({
        url: `/reservations/walk-in/${id}/status?status=${status}`,
        method: 'PATCH',
      }),
      transformErrorResponse: transformWalkInStayError,
      invalidatesTags: (result, _error, { id }) => [
        { type: 'WalkInStay', id },
        { type: 'WalkInStay', id: 'LIST' },
        { type: 'ParkingLotWalkIns', id: 'LIST' },
      ],
    }),

    // Extend walk-in stay time
    extendWalkInStayTime: builder.mutation<ApiResponse<WalkInStayResponse>, ExtendTimeParams>({
      query: ({ id, extraHours }) => ({
        url: `/reservations/walk-in/${id}/extend?extraHours=${extraHours}`,
        method: 'PATCH',
      }),
      transformErrorResponse: transformWalkInStayError,
      invalidatesTags: (result, _error, { id }) => [
        { type: 'WalkInStay', id },
        { type: 'WalkInStay', id: 'LIST' },
        { type: 'ParkingLotWalkIns', id: 'LIST' },
        { type: 'WalkInStay', id: `${id}-remaining-time` },
      ],
    }),

    // Get walk-in stays by parking lot ID
    getWalkInStaysByParkingLot: builder.query<
      ApiResponse<PaginatedResponse<WalkInStayResponse>>,
      GetWalkInStaysByParkingLotParams
    >({
      query: ({ parkingLotId, ...filters }) => {
        const queryString = buildQueryParams(filters);
        return {
          url: `/parking-lots/${parkingLotId}/reservations/walk-in${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result, _error, { parkingLotId }) =>
        result?.data
          ? [
              ...result.data.content.map((stay) => ({
                type: 'WalkInStay' as const,
                id: stay.id,
              })),
              { type: 'ParkingLotWalkIns' as const, id: parkingLotId },
              { type: 'WalkInStay' as const, id: 'LIST' },
            ]
          : [
              { type: 'ParkingLotWalkIns' as const, id: parkingLotId },
              { type: 'WalkInStay' as const, id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useCreateWalkInStayMutation,
  useGetWalkInStaysQuery,
  useGetWalkInStayByIdQuery,
  useGetRemainingTimeQuery,
  useUpdateWalkInStayStatusMutation,
  useExtendWalkInStayTimeMutation,
  useGetWalkInStaysByParkingLotQuery,
} = walkInStaysApi;
