import { useCallback } from 'react';
import { useGetSpotsByParkingLotIdQuery } from '@parking/api/parkingApi';
import { useModalState } from './state/useModalState';
import { useSpotSelection } from './state/useSpotSelection';
import { useSpotMutations } from './mutations/useSpotMutations';
import { useDashboardMetrics } from './data/useDashboardMetrics';
import { useSpotsData } from './data/useSpotsData';

export function useDashboardState(lotId: number | null) {
  const isValidLot = lotId && !isNaN(lotId);
  
  // Use spots data hook which handles filters and pagination
  const spotsData = useSpotsData(lotId!);
  
  // Local UI state management
  const modalState = useModalState();
  const { selectedSpot, selectSpot, clearSelection, setSelectedSpot } = useSpotSelection(spotsData.spotsData);
  
  // Mutation management
  const spotMutations = useSpotMutations(lotId!);
  
  // Computed values
  const metrics = useDashboardMetrics(spotsData.allSpotsData);
  
  // Event handlers
  const handleSpotClick = useCallback((spot: any) => {
    selectSpot(spot);
    modalState.openModal('spotDetail');
  }, [selectSpot, modalState]);

  const handleCreateSpot = useCallback((data: any) => {
    spotMutations.mutations.createSpot(lotId!, data, () => {
      modalState.closeModal('createSpot');
    });
  }, [spotMutations.mutations, modalState, lotId]);

  const handleUpdateSpot = useCallback((spotId: number, data: any) => {
    spotMutations.mutations.updateSpot(spotId, data, () => {
      modalState.closeModal('editSpot');
      if (selectedSpot && selectedSpot.id === spotId) {
        setSelectedSpot({ ...selectedSpot, ...data });
      }
    });
  }, [spotMutations.mutations, modalState, selectedSpot, setSelectedSpot]);

  const handleDeleteSpot = useCallback((spotId: number) => {
    spotMutations.mutations.deleteSpot(spotId, () => {
      modalState.resetConfirmDelete();
      clearSelection();
      modalState.closeModal('spotDetail');
    });
  }, [spotMutations.mutations, modalState, clearSelection]);

  return {
    // Data
    spots: spotsData.spotsData,
    metrics,
    selectedSpot,
    spotFilters: spotsData.spotFilters,
    availableFilters: spotsData.availableFilters,
    
    // State
    modalState,
    loadingStates: spotMutations.loadingStates,
    
    // Loading/Error states
    isLoading: spotsData.spots.isLoading,
    isError: spotsData.spots.isError,
    
    // Actions
    handleSpotClick,
    handleCreateSpot,
    handleUpdateSpot,
    handleDeleteSpot,
    setSelectedSpot,
    setSpotFilters: spotsData.setSpotFilters,
    refetch: spotsData.refetchSpots,
  };
}
