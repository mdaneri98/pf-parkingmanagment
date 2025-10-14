import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type {
  ParkingPriceResponse,
  PriceModalState,
  PriceConfirmDeleteState,
  PriceSearchFilters
} from '../types';

export interface PriceFilterState {
  minPrice?: number;
  maxPrice?: number;
  vehicleType?: string;
  startDate?: Date;
  endDate?: Date;
  sort: 'asc' | 'desc';
  showActiveOnly: boolean;
  showExpiredOnly: boolean;
}
export interface PricesState {
  selectedPrice: ParkingPriceResponse | null;
  modalState: PriceModalState;
  confirmDeleteState: PriceConfirmDeleteState | null;
  filters: PriceSearchFilters;
  uiFilters: PriceFilterState;
}

const initialState: PricesState = {
  selectedPrice: null,
  modalState: {
    create: false,
    edit: false,
    detail: false,
  },
  confirmDeleteState: null,
  filters: {
    sort: 'asc',
  },
  uiFilters: {
    sort: 'asc',
    showActiveOnly: false,
    showExpiredOnly: false,
  },
};

const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {
    setSelectedPrice(state, action: PayloadAction<ParkingPriceResponse | null>) {
      state.selectedPrice = action.payload;
    },

    openCreateModal(state) {
      state.modalState.create = true;
      state.selectedPrice = null;
    },

    openEditModal(state, action: PayloadAction<ParkingPriceResponse>) {
      state.modalState.edit = true;
      state.selectedPrice = action.payload;
    },

    openDetailModal(state, action: PayloadAction<ParkingPriceResponse>) {
      state.modalState.detail = true;
      state.selectedPrice = action.payload;
    },

    closeModal(state, action: PayloadAction<keyof PriceModalState>) {
      state.modalState[action.payload] = false;
      if (action.payload === 'edit' || action.payload === 'detail') {
        state.selectedPrice = null;
      }
    },

    closeAllModals(state) {
      state.modalState = {
        create: false,
        edit: false,
        detail: false,
      };
      state.selectedPrice = null;
    },

    openConfirmDelete(state, action: PayloadAction<ParkingPriceResponse>) {
      const price = action.payload;
      state.confirmDeleteState = {
        type: 'price',
        id: price.id,
        priceInfo: {
          vehicleType: price.vehicleType,
          price: price.price,
          validFrom: price.validFrom,
          validTo: price.validTo,
        },
      };
    },

    closeConfirmDelete(state) {
      state.confirmDeleteState = null;
    },

    setFilters(state, action: PayloadAction<Partial<PriceSearchFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },

    resetFilters(state) {
      state.filters = { sort: 'asc' };
      state.uiFilters = {
        sort: 'asc',
        showActiveOnly: false,
        showExpiredOnly: false,
      };
    },

    // UI Filter actions
    setUiFilters(state, action: PayloadAction<Partial<PriceFilterState>>) {
      state.uiFilters = { ...state.uiFilters, ...action.payload };
    },

    resetUiFilters(state) {
      state.uiFilters = {
        sort: 'asc',
        showActiveOnly: false,
        showExpiredOnly: false,
      };
    },

    resetPricesState: () => initialState,
  },
});

export const {
  setSelectedPrice,
  openCreateModal,
  openEditModal,
  openDetailModal,
  closeModal,
  closeAllModals,
  openConfirmDelete,
  closeConfirmDelete,
  setFilters,
  resetFilters,
  setUiFilters,
  resetUiFilters,
  resetPricesState,
} = pricesSlice.actions;

export const pricesReducer = pricesSlice.reducer;
