import { configureStore } from '@reduxjs/toolkit';
import parkingLotReducer from './parkingLotSlice';
import spotReducer from './spotSlice';

export const store = configureStore({
  reducer: {
    parkingLot: parkingLotReducer,
    spot: spotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 