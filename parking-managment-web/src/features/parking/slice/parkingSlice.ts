import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { ParkingLotResponse } from '../types';
import { appStorage } from '@shared/utils/storage';

interface ParkingState {
  selectedParkingLotId: number | null;
  parkingLots: ParkingLotResponse[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

const initialState: ParkingState = {
  selectedParkingLotId: null, // Will be loaded after auth is confirmed
  parkingLots: [],
  isLoading: false,
  isError: false,
  error: null,
};

const parkingSlice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    setSelectedParkingLotId(state, action: PayloadAction<number | null>) {
      if (state.selectedParkingLotId === action.payload) {
        return; 
      }
      state.selectedParkingLotId = action.payload;
      
      // Persist to localStorage
      if (action.payload !== null) {
        appStorage.setSelectedParkingLotId(action.payload);
      } else {
        appStorage.clearSelectedParkingLotId();
      }
    },
    setParkingLots(state, action: PayloadAction<ParkingLotResponse[]>) {
      state.parkingLots = action.payload;
      state.isError = false;
      state.error = null;
    },
    setParkingLotsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setParkingLotsError(state, action: PayloadAction<string>) {
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false;
    },
    clearParkingLotsError(state) {
      state.isError = false;
      state.error = null;
    },
    initializeSelectedLotId(state) {
      const persistedLotId = appStorage.getSelectedParkingLotId();
      if (persistedLotId !== null) {
        state.selectedParkingLotId = persistedLotId;
      }
    },
    resetParkingState: () => {
      appStorage.clearSelectedParkingLotId();
      return initialState;
    },
  },
});

export const { 
  setSelectedParkingLotId, 
  setParkingLots,
  setParkingLotsLoading,
  setParkingLotsError,
  clearParkingLotsError,
  initializeSelectedLotId,
  resetParkingState 
} = parkingSlice.actions;
export const parkingReducer = parkingSlice.reducer;
