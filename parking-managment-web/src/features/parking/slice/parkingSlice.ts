import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../../stores/store';

export interface ParkingState {
  selectedParkingLotId: number | null;
  sidebarCollapsed: boolean;
}

const initialState: ParkingState = {
  selectedParkingLotId: null,
  sidebarCollapsed: false,
};

const slice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    setSelectedParkingLotId(state, action: PayloadAction<number | null>) {
      state.selectedParkingLotId = action.payload;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { setSelectedParkingLotId, setSidebarCollapsed, toggleSidebar } = slice.actions;
export const parkingReducer = slice.reducer;

// Selectors
export const selectParking = (state: RootState) => state.parking;
export const selectSelectedParkingLotId = (state: RootState) => state.parking.selectedParkingLotId;
export const selectSidebarCollapsed = (state: RootState) => state.parking.sidebarCollapsed;


