import { useParams } from 'react-router-dom';
import { DashboardHeader } from '@parking/components/dashboard/DashboardHeader';
import { MetricsGrid } from '@parking/components/dashboard/MetricsGrid';
import { SpotsSection } from '@parking/components/dashboard/SpotsSection';
import { DashboardModals } from '@parking/components/dashboard/DashboardModals';
import { LoadingState, ErrorState, EmptyState } from '@parking/components/common';
import { useAppSelector } from '@hooks/useAppSelector';
import { selectSelectedParkingLotId } from '@parking/selectors/parkingLotSelectors';
import { useGetParkingLotByIdQuery } from '@parking/api/parkingApi';
import { useDashboardState } from '@parking/hooks';
import { PARKING_CONSTANTS } from '@parking/constants/parking';

export function DashboardPage() {
  const params = useParams();
  const selectedLotId = useAppSelector(selectSelectedParkingLotId);
  
  const lotId = params.lotId ? Number(params.lotId) : null;
  const isValidLot = lotId && !isNaN(lotId);


  const { 
    data: lotData, 
    isLoading: isLotLoading, 
    isError: isLotError, 
    refetch: refetchLot 
  } = useGetParkingLotByIdQuery(lotId!, {
    skip: !isValidLot,
    pollingInterval: PARKING_CONSTANTS.POLLING.DASHBOARD_INTERVAL,
  });

  const {
    spots,
    metrics,
    selectedSpot,
    modalState,
    loadingStates,
    spotFilters,
    availableFilters,
    isLoading: isSpotsLoading,
    isError: isSpotsError,
    refetch: refetchSpots,
    handleSpotClick,
    handleCreateSpot,
    handleUpdateSpot,
    handleDeleteSpot,
    setSelectedSpot,
    setSpotFilters,
  } = useDashboardState(lotId);

  // Early returns for invalid states
  if (!isValidLot) {
    return (
      <EmptyState
        title="Select a Parking Lot"
        message="Choose a parking lot from the sidebar to view its dashboard and manage spots."
      />
    );
  }

  if (isLotLoading) {
    return <LoadingState />;
  }

  if (isLotError) {
    return (
      <ErrorState
        title="Failed to Load Dashboard"
        message="Unable to fetch parking lot data. Please check your connection and try again."
        onRetry={refetchLot}
      />
    );
  }

  const lotName = lotData?.data?.name ?? `Lot ${lotId}`;

  return (
    <div className="space-y-8">
      <DashboardHeader
        lotName={lotName}
      />

      <MetricsGrid metrics={metrics} />

      <SpotsSection
        spots={spots}
        isLoading={isSpotsLoading}
        isError={isSpotsError}
        onRetry={() => {
          refetchLot();
          refetchSpots();
        }}
        onCreateSpot={() => modalState.openModal('createSpot')}
        onSpotClick={handleSpotClick}
        onFiltersChange={setSpotFilters}
        availableFilters={availableFilters}
        spotFilters={spotFilters}
        isCreating={loadingStates.createSpot}
      />

      <DashboardModals
        modalState={modalState}
        selectedSpot={selectedSpot || undefined}
        lotId={lotId}
        loadingStates={loadingStates}
        spots={spots}
        onCreateSpot={handleCreateSpot}
        onUpdateSpot={handleUpdateSpot}
        onDeleteSpot={handleDeleteSpot}
        onSpotModalClose={() => {
          modalState.closeModal('spotDetail');
          if (spots.length > 0) {
            setSelectedSpot(spots[0]);
          }
        }}
        onRefetchSpots={refetchSpots}
      />
    </div>
  );
}