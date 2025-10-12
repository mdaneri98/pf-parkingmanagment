import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { 
  WalkInStayResponse,
  WalkInStayModalState,
} from '../types';

export interface WalkInStayState {
  selectedWalkInStay: WalkInStayResponse | null;
  modalState: WalkInStayModalState;
  activeWalkInStays: Record<number, WalkInStayResponse>; // Map spotId -> active walk-in stay
}

const initialState: WalkInStayState = {
  selectedWalkInStay: null,
  modalState: {
    createForm: false,
    extendForm: false,
  },
  activeWalkInStays: {},
};

const walkInStaySlice = createSlice({
  name: 'walkInStay',
  initialState,
  reducers: {
    setSelectedWalkInStay(state, action: PayloadAction<WalkInStayResponse | null>) {
      state.selectedWalkInStay = action.payload;
    },

    openModal(state, action: PayloadAction<keyof WalkInStayModalState>) {
      state.modalState[action.payload] = true;
    },

    closeModal(state, action: PayloadAction<keyof WalkInStayModalState>) {
      state.modalState[action.payload] = false;
    },

    closeAllModals(state) {
      state.modalState = {
        createForm: false,
        extendForm: false,
      };
    },

    setActiveForSpot(state, action: PayloadAction<{ spotId: number; walkInStay: WalkInStayResponse }>) {
      const { spotId, walkInStay } = action.payload;
      state.activeWalkInStays[spotId] = walkInStay;
    },

    clearActiveForSpot(state, action: PayloadAction<number>) {
      delete state.activeWalkInStays[action.payload];
    },

    clearAllActive(state) {
      state.activeWalkInStays = {};
    },

    resetWalkInStayState: () => initialState,
  },
});

export const {
  setSelectedWalkInStay,
  openModal,
  closeModal,
  closeAllModals,
  setActiveForSpot,
  clearActiveForSpot,
  clearAllActive,
  resetWalkInStayState,
} = walkInStaySlice.actions;

export const walkInStayReducer = walkInStaySlice.reducer;

