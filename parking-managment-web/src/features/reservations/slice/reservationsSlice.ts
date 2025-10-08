import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { ReservationResponse } from '../types';

export interface ReservationFilterState {
    status?: string;
    from?: string;
    to?: string;
    sort: 'asc' | 'desc';
    showActiveOnly: boolean;
    showCancelledOnly: boolean;
}

export interface ReservationsState {
    selectedReservation: ReservationResponse | null;
    filters: ReservationFilterState;
}

const initialState: ReservationsState = {
    selectedReservation: null,
    filters: {
        status: 'PENDING',
        sort: 'asc',
        showActiveOnly: false,
        showCancelledOnly: false,
    },
};

const reservationsSlice = createSlice({
    name: 'reservations',
    initialState,
    reducers: {
        setSelectedReservation(state, action: PayloadAction<ReservationResponse | null>) {
            state.selectedReservation = action.payload;
        },
        setFilters(state, action: PayloadAction<Partial<ReservationFilterState>>) {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters(state) {
            state.filters = {
                status: 'PENDING',
                sort: 'asc',
                showActiveOnly: false,
                showCancelledOnly: false,
            };
        },
        resetReservationsState() {
            return initialState;
        },
    },
});

export const {
    setSelectedReservation,
    setFilters,
    resetFilters,
    resetReservationsState,
} = reservationsSlice.actions;

// Export the reducer as a named export
export const reservationsReducer = reservationsSlice.reducer;
