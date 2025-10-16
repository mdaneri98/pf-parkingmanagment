import { useParams } from 'react-router-dom';
import { LicensePlateSearch } from '@parking/components/dashboard/LicensePlateSearch';
import { LoadingState, ErrorState, EmptyState } from '@parking/components/common';
import { useGetParkingLotByIdQuery } from '@parking/api/parkingApi';
import { PARKING_CONSTANTS } from '@parking/constants/parking';
import { useModalState } from '@parking/hooks/state/useModalState';
import { useSpotSelection } from '@parking/hooks/state/useSpotSelection';
import { useSpotMutations } from '@parking/hooks/mutations/useSpotMutations';
import { DashboardModals } from '@parking/components/dashboard/DashboardModals';
import { useGetSpotsByParkingLotIdQuery } from '@parking/api/parkingApi';
import { useCallback } from 'react';

export function LicensePlateSearchPage() {
  const params = useParams();
  const lotId = params.lotId ? Number(params.lotId) : null;
  const isValidLot = lotId && !isNaN(lotId);

  const { 
    data: lotData, 
    isLoading: isLotLoading, 
    isError: isLotError, 
    refetch: refetchLot 
  } = useGetParkingLotByIdQuery(lotId!, {
    skip: !isValidLot,
  });

  // Fetch all spots for modal functionality
  const { data: spotsData, refetch: refetchSpots } = useGetSpotsByParkingLotIdQuery(
    { 
      parkingLotId: lotId!, 
      page: 0, 
      size: PARKING_CONSTANTS.PAGINATION.FETCH_ALL_SIZE,
    },
    {
      skip: !isValidLot,
    }
  );

  const allSpots = spotsData?.data?.content || [];

  // Modal and spot selection state
  const modalState = useModalState();
  const { selectedSpot, selectSpot, clearSelection, setSelectedSpot } = useSpotSelection(allSpots);
  
  // Spot mutations
  const spotMutations = useSpotMutations(lotId!);

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

  // Early returns for invalid states
  if (!isValidLot) {
    return (
      <EmptyState
        title="Select a Parking Lot"
        message="Choose a parking lot from the sidebar to search for vehicles by license plate."
      />
    );
  }

  if (isLotLoading) {
    return <LoadingState />;
  }

  if (isLotError) {
    return (
      <ErrorState
        title="Failed to Load Parking Lot"
        message="Unable to fetch parking lot data. Please check your connection and try again."
        onRetry={refetchLot}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <LicensePlateSearch 
        lotId={lotId} 
        onSpotClick={handleSpotClick}
      />

      <DashboardModals
        modalState={modalState}
        selectedSpot={selectedSpot || undefined}
        lotId={lotId}
        loadingStates={spotMutations.loadingStates}
        spots={allSpots}
        onCreateSpot={handleCreateSpot}
        onUpdateSpot={handleUpdateSpot}
        onDeleteSpot={handleDeleteSpot}
        onSpotModalClose={() => {
          modalState.closeModal('spotDetail');
          if (allSpots.length > 0) {
            setSelectedSpot(allSpots[0]);
          }
        }}
        onRefetchSpots={refetchSpots}
      />
    </div>
  );
}

