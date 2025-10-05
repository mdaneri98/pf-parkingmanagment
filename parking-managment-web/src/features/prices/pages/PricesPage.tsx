import { useParams } from 'react-router-dom';
import { PricesManagement } from '../components/PricesManagement';
import { LoadingState, ErrorState, EmptyState } from '@parking/components/common';
import { useGetParkingLotByIdQuery } from '@parking/api/parkingApi';

export function PricesPage() {
  const { lotId } = useParams<{ lotId: string }>();
  const parkingLotId = lotId ? parseInt(lotId, 10) : null;

  // Fetch parking lot data to validate access
  const {
    data: lotResponse,
    isLoading: isLotLoading,
    isError: isLotError,
    refetch: refetchLot,
  } = useGetParkingLotByIdQuery(parkingLotId!, {
    skip: !parkingLotId,
  });

  // Early returns for invalid states
  if (!parkingLotId) {
    return (
      <EmptyState
        title="Select a Parking Lot"
        message="Choose a parking lot from the sidebar to manage its pricing rules."
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

  if (!lotResponse?.data) {
    return (
      <EmptyState
        title="Parking Lot Not Found"
        message="The requested parking lot could not be found."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PricesManagement
        parkingLotId={parkingLotId}
        canEdit={true}
        canDelete={true}
        onPriceCreated={() => {
          // Price creation handled by Redux state updates
        }}
        onPriceUpdated={() => {
          // Price updates handled by Redux state updates
        }}
        onPriceDeleted={() => {
          // Price deletion handled by Redux state updates
        }}
      />
    </div>
  );
}
