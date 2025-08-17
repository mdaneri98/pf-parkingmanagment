import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ParkingState {
  selectedParkingLotId: number | null;
}

const initialState: ParkingState = {
  selectedParkingLotId: null,
};

const slice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    setSelectedParkingLotId(state, action: PayloadAction<number | null>) {
      state.selectedParkingLotId = action.payload;
    },
  },
});

export const { setSelectedParkingLotId } = slice.actions;
export const parkingReducer = slice.reducer;


