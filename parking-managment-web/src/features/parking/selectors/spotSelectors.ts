import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@stores/store';
import type { SpotDTO } from '../types';

// Basic spot state selectors (when spots are added to the slice)
// These are placeholders for future spot state management
export const selectSpots = (state: RootState): SpotDTO[] => (state.parking as any).spots || [];
export const selectSelectedSpotId = (state: RootState): number | null => (state.parking as any).selectedSpotId || null;
export const selectSpotsLoading = (state: RootState): boolean => (state.parking as any).spotsLoading || false;
export const selectSpotsError = (state: RootState): string | null => (state.parking as any).spotsError || null;

// Memoized selectors for spot data
export const selectSelectedSpot = createSelector(
  [selectSpots, selectSelectedSpotId],
  (spots, selectedSpotId) => {
    if (!selectedSpotId) return null;
    return spots.find((spot: SpotDTO) => spot.id === selectedSpotId) || null;
  }
);

export const selectSpotsByLotId = createSelector(
  [selectSpots, (state: RootState, lotId: number) => lotId],
  (spots, lotId) => spots.filter((spot: SpotDTO) => spot.parkingLotId === lotId)
);

export const selectAvailableSpots = createSelector(
  [selectSpots],
  (spots) => spots.filter((spot: SpotDTO) => spot.isAvailable)
);

export const selectOccupiedSpots = createSelector(
  [selectSpots],
  (spots) => spots.filter((spot: SpotDTO) => !spot.isAvailable)
);
