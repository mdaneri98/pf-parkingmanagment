import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@stores/store';
import { buildPriceSearchFilters } from '@prices/utils/priceUtils';

// Base selectors
export const selectPrices = (state: RootState) => state.prices;
export const selectSelectedPrice = (state: RootState) => state.prices.selectedPrice;
export const selectPriceModalState = (state: RootState) => state.prices.modalState;
export const selectPriceConfirmDeleteState = (state: RootState) => state.prices.confirmDeleteState;
export const selectPriceFilters = (state: RootState) => state.prices.filters;
export const selectPriceUiFilters = (state: RootState) => state.prices.uiFilters;

// Modal state selectors
export const selectIsCreateModalOpen = (state: RootState) => state.prices.modalState.create;
export const selectIsEditModalOpen = (state: RootState) => state.prices.modalState.edit;
export const selectIsDetailModalOpen = (state: RootState) => state.prices.modalState.detail;
export const selectIsConfirmDeleteOpen = (state: RootState) => state.prices.confirmDeleteState !== null;

// Memoized derived selectors
export const selectIsAnyModalOpen = createSelector(
  [selectPriceModalState],
  (modalState) => Object.values(modalState).some(isOpen => isOpen)
);

export const selectHasSelectedPrice = createSelector(
  [selectSelectedPrice],
  (selectedPrice) => selectedPrice !== null
);

// Filter-related selectors
export const selectApiFilters = createSelector(
  [selectPriceUiFilters],
  (uiFilters) => buildPriceSearchFilters({
    minPrice: uiFilters.minPrice,
    maxPrice: uiFilters.maxPrice,
    vehicleType: uiFilters.vehicleType,
    startDate: uiFilters.startDate,
    endDate: uiFilters.endDate,
    sort: uiFilters.sort,
  })
);

export const selectHasActiveFilters = createSelector(
  [selectPriceUiFilters],
  (uiFilters) => {
    const defaultFilters = {
      sort: 'asc' as const,
      showActiveOnly: false,
      showExpiredOnly: false,
    };
    
    return (
      uiFilters.minPrice !== undefined ||
      uiFilters.maxPrice !== undefined ||
      uiFilters.vehicleType !== undefined ||
      uiFilters.startDate !== undefined ||
      uiFilters.endDate !== undefined ||
      uiFilters.showActiveOnly !== defaultFilters.showActiveOnly ||
      uiFilters.showExpiredOnly !== defaultFilters.showExpiredOnly ||
      uiFilters.sort !== defaultFilters.sort
    );
  }
);

export const selectActiveFilterCount = createSelector(
  [selectPriceUiFilters],
  (uiFilters) => {
    let count = 0;
    if (uiFilters.minPrice !== undefined) count++;
    if (uiFilters.maxPrice !== undefined) count++;
    if (uiFilters.vehicleType !== undefined) count++;
    if (uiFilters.startDate !== undefined) count++;
    if (uiFilters.endDate !== undefined) count++;
    if (uiFilters.showActiveOnly) count++;
    if (uiFilters.showExpiredOnly) count++;
    if (uiFilters.sort !== 'asc') count++;
    return count;
  }
);

export const selectFilterSummary = createSelector(
  [selectPriceUiFilters],
  (uiFilters) => {
    const summary: string[] = [];
    
    if (uiFilters.minPrice !== undefined) {
      summary.push(`Min: $${uiFilters.minPrice}`);
    }
    if (uiFilters.maxPrice !== undefined) {
      summary.push(`Max: $${uiFilters.maxPrice}`);
    }
    if (uiFilters.vehicleType) {
      summary.push(`Type: ${uiFilters.vehicleType}`);
    }
    if (uiFilters.startDate) {
      summary.push(`From: ${uiFilters.startDate.toLocaleDateString()}`);
    }
    if (uiFilters.endDate) {
      summary.push(`To: ${uiFilters.endDate.toLocaleDateString()}`);
    }
    if (uiFilters.showActiveOnly) {
      summary.push('Active only');
    }
    if (uiFilters.showExpiredOnly) {
      summary.push('Expired only');
    }
    if (uiFilters.sort === 'desc') {
      summary.push('Price: High to Low');
    }
    
    return summary;
  }
);
