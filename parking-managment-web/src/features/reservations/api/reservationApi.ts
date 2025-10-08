import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, PaginatedResponse } from '@shared/types';
import type { ReservationResponse, ReservationFilters } from '../types';
import { smartBaseQuery } from '@shared/api/baseQuery';

interface GetReservationsByParkingLotParams extends ReservationFilters {
    parkingLotId: number;
    page?: number;
    size?: number;
}

export const reservationApi = createApi({
    reducerPath: 'reservationApi',
    baseQuery: smartBaseQuery,
    tagTypes: ['Reservation', 'ParkingLotReservations'],

    endpoints: (builder) => ({
        getReservationsByParkingLotId: builder.query<
            ApiResponse<PaginatedResponse<ReservationResponse>>,
            GetReservationsByParkingLotParams>({
            query: ({ parkingLotId, ...filters }) => {
                const queryString = buildQueryParams(filters);
                return {
                    url: `/parking-lots/${parkingLotId}/reservations${queryString ? `?${queryString}` : ''}`,
                };
            },
            providesTags: (result, _error, { parkingLotId }) =>
                result?.data
                    ? [
                        ...result.data.content.map((reservation) => ({
                            type: 'Reservation' as const,
                            id: reservation.id,
                        })),
                        { type: 'ParkingLotReservations' as const, id: parkingLotId },
                        { type: 'Reservation' as const, id: 'LIST' },
                    ]
                    : [
                        { type: 'ParkingLotReservations' as const, id: parkingLotId },
                        { type: 'Reservation' as const, id: 'LIST' },
                    ],
        }),

        updateReservationStatus: builder.mutation<
            ApiResponse<ReservationResponse>,
            { id: number; status: string }
        >({
            query: ({ id, status }) => ({
                url: `/reservations/scheduled/${id}/status?status=${status}`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, _error, { id }) => [
                { type: 'Reservation', id },
                { type: 'Reservation', id: 'LIST' },
            ],
        }),

    }),
});



const buildQueryParams = (params: Record<string, unknown>): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
        }
    });

    return searchParams.toString();
};


export const {
    useGetReservationsByParkingLotIdQuery,
    useUpdateReservationStatusMutation,
} = reservationApi;