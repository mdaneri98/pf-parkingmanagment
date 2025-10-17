import type { RootState } from '@stores/store';

/**
 * Select the selected walk-in stay
 */
export const selectSelectedWalkInStay = (state: RootState) => 
  state.walkInStay.selectedWalkInStay;

/**
 * Select the modal state
 */
export const selectWalkInStayModalState = (state: RootState) => 
  state.walkInStay.modalState;

/**
 * Select active walk-in stay for a specific spot
 */
export const selectActiveWalkInStayForSpot = (spotId: number) => (state: RootState) =>
  state.walkInStay.activeWalkInStays[spotId];

/**
 * Select all active walk-in stays
 */
export const selectAllActiveWalkInStays = (state: RootState) =>
  state.walkInStay.activeWalkInStays;

