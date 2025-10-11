import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { WalkInStayResponse, WalkInStayStatus } from '../types';

export interface WalkInStayFilterState {
  status?: WalkInStayStatus;
  vehiclePlate?: string;
  showActiveOnly: boolean;
  sort: 'asc' | 'desc';
}

export interface WalkInStaysState {
  selectedWalkInStay: WalkInStayResponse | null;
  filters: WalkInStayFilterState;
  isCreateModalOpen: boolean;
  isExtendModalOpen: boolean;
}

const initialState: WalkInStaysState = {
  selectedWalkInStay: null,
  filters: {
    sort: 'desc',
    showActiveOnly: false,
  },
  isCreateModalOpen: false,
  isExtendModalOpen: false,
};

const walkInStaysSlice = createSlice({
  name: 'walkInStays',
  initialState,
  reducers: {
    setSelectedWalkInStay(state, action: PayloadAction<WalkInStayResponse | null>) {
      state.selectedWalkInStay = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<WalkInStayFilterState>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = {
        sort: 'desc',
        showActiveOnly: false,
      };
    },
    openCreateModal(state) {
      state.isCreateModalOpen = true;
    },
    closeCreateModal(state) {
      state.isCreateModalOpen = false;
    },
    openExtendModal(state) {
      state.isExtendModalOpen = true;
    },
    closeExtendModal(state) {
      state.isExtendModalOpen = false;
    },
    resetWalkInStaysState() {
      return initialState;
    },
  },
});

export const {
  setSelectedWalkInStay,
  setFilters,
  resetFilters,
  openCreateModal,
  closeCreateModal,
  openExtendModal,
  closeExtendModal,
  resetWalkInStaysState,
} = walkInStaysSlice.actions;

// Export the reducer as a named export
export const walkInStaysReducer = walkInStaysSlice.reducer;
