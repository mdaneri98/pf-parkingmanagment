import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '@shared/types';
import type {
  ParkingPriceResponse,
  ParkingPriceRequest,
  PriceSearchFilters,
} from '@prices/types';
import { smartBaseQuery } from '@shared/api/baseQuery';

interface GetPricesByParkingLotIdParams extends PriceSearchFilters {
  parkingLotId: number;
}

interface CreatePriceParams {
  parkingLotId: number;
  body: ParkingPriceRequest;
}

interface UpdatePriceParams {
  parkingLotId: number;
  priceId: number;
  body: ParkingPriceRequest;
}

interface DeletePriceParams {
  parkingLotId: number;
  priceId: number;
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

const transformPriceError = (response: any) => {
  const errorMap: Record<number, { message: string; code: string }> = {
    400: { 
      message: 'Invalid price data provided', 
      code: 'VALIDATION_ERROR' 
    },
    403: { 
      message: 'Not authorized to manage prices for this parking lot', 
      code: 'UNAUTHORIZED' 
    },
    404: { 
      message: 'Price rule not found', 
      code: 'NOT_FOUND' 
    },
    409: { 
      message: 'Price period overlaps with existing rule for the same vehicle type', 
      code: 'OVERLAPPING_PERIOD' 
    },
  };

  const error = errorMap[response.status];
  return error ? { ...error, status: response.status } : response;
};

export const pricesApi = createApi({
  reducerPath: 'pricesApi',
  baseQuery: smartBaseQuery,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Price', 'ParkingLotPrices'],
  endpoints: (builder) => ({
    getPricesByParkingLotId: builder.query<ApiResponse<ParkingPriceResponse[]>, GetPricesByParkingLotIdParams>({
      query: ({ parkingLotId, ...filters }) => {
        const queryString = buildQueryParams(filters);
        return {
          url: `/parking-lots/${parkingLotId}/prices${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (result, _error, { parkingLotId }) =>
        result?.data
          ? [
              ...result.data.map((price) => ({ type: 'Price' as const, id: price.id })),
              { type: 'ParkingLotPrices' as const, id: parkingLotId },
              { type: 'Price' as const, id: 'LIST' },
            ]
          : [
              { type: 'ParkingLotPrices' as const, id: parkingLotId },
              { type: 'Price' as const, id: 'LIST' },
            ],
    }),

    createPrice: builder.mutation<ApiResponse<ParkingPriceResponse>, CreatePriceParams>({
      query: ({ parkingLotId, body }) => ({
        url: `/parking-lots/${parkingLotId}/prices`,
        method: 'POST',
        body,
      }),
      transformErrorResponse: transformPriceError,
      invalidatesTags: (result, _error, { parkingLotId }) => [
        { type: 'ParkingLotPrices', id: parkingLotId },
        { type: 'Price', id: 'LIST' },
      ],
    }),

    updatePrice: builder.mutation<ApiResponse<ParkingPriceResponse>, UpdatePriceParams>({
      query: ({ parkingLotId, priceId, body }) => ({
        url: `/parking-lots/${parkingLotId}/prices/${priceId}`,
        method: 'PUT',
        body,
      }),
      transformErrorResponse: transformPriceError,
      invalidatesTags: (result, _error, { parkingLotId, priceId }) => [
        { type: 'Price', id: priceId },
        { type: 'ParkingLotPrices', id: parkingLotId },
        { type: 'Price', id: 'LIST' },
      ],
    }),

    deletePrice: builder.mutation<ApiResponse<void>, DeletePriceParams>({
      query: ({ parkingLotId, priceId }) => ({
        url: `/parking-lots/${parkingLotId}/prices/${priceId}`,
        method: 'DELETE',
      }),
      transformErrorResponse: (response: any) => {
        const deleteErrorMap: Record<number, { message: string; code: string }> = {
          403: { 
            message: 'Not authorized to manage prices for this parking lot', 
            code: 'UNAUTHORIZED' 
          },
          404: { 
            message: 'Price rule not found', 
            code: 'NOT_FOUND' 
          },
          409: { 
            message: 'Cannot delete price rule - it may be in use', 
            code: 'CONFLICT' 
          },
        };

        const error = deleteErrorMap[response.status];
        return error ? { ...error, status: response.status } : response;
      },
      invalidatesTags: (result, _error, { parkingLotId, priceId }) => [
        { type: 'Price', id: priceId },
        { type: 'ParkingLotPrices', id: parkingLotId },
        { type: 'Price', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPricesByParkingLotIdQuery,
  useCreatePriceMutation,
  useUpdatePriceMutation,
  useDeletePriceMutation,
} = pricesApi;
