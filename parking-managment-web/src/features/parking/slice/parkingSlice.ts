import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { ParkingLotResponse } from '../types';

interface ParkingState {
  selectedParkingLotId: number | null;
  parkingLots: ParkingLotResponse[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

const initialState: ParkingState = {
  selectedParkingLotId: null,
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
      state.selectedParkingLotId = action.payload;
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
    resetParkingState: () => initialState,
  },
});

export const { 
  setSelectedParkingLotId, 
  setParkingLots,
  setParkingLotsLoading,
  setParkingLotsError,
  clearParkingLotsError,
  resetParkingState 
} = parkingSlice.actions;
export const parkingReducer = parkingSlice.reducer;
