import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@stores/store';
import type { ParkingLotResponse } from '../types';

// Basic parking lot state selectors
export const selectParkingLots = (state: RootState): ParkingLotResponse[] => state.parking.parkingLots;
export const selectSelectedParkingLotId = (state: RootState): number | null => state.parking.selectedParkingLotId;
export const selectParkingLotsLoading = (state: RootState): boolean => state.parking.isLoading;
export const selectParkingLotsError = (state: RootState): boolean => state.parking.isError;
export const selectParkingLotsErrorMessage = (state: RootState): string | null => state.parking.error;

// Memoized selectors for parking lot data
export const selectSelectedParkingLot = createSelector(
  [selectParkingLots, selectSelectedParkingLotId],
  (parkingLots, selectedLotId): ParkingLotResponse | null => {
    if (!selectedLotId) return null;
    return parkingLots.find(lot => lot.id === selectedLotId) || null;
  }
);

export const selectParkingLotById = createSelector(
  [selectParkingLots, (state: RootState, lotId: number) => lotId],
  (parkingLots, lotId): ParkingLotResponse | null => parkingLots.find(lot => lot.id === lotId) || null
);

