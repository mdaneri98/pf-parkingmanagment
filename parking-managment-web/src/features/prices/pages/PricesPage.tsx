import { useParams } from 'react-router-dom';
import { PricesManagement } from '../components/PricesManagement';
import { LoadingState, ErrorState, EmptyState } from '@parking/components/common';
import { useGetParkingLotByIdQuery } from '@parking/api/parkingApi';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

export function PricesPage() {
  const { lotId } = useParams<{ lotId: string }>();
  const parkingLotId = lotId ? parseInt(lotId, 10) : null;
  const { t } = useTypedTranslation();

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
        title={t('prices.selectLotTitle')}
        message={t('prices.selectLotMessage')}
      />
    );
  }

  if (isLotLoading) {
    return <LoadingState />;
  }

  if (isLotError) {
    return (
      <ErrorState
        title={t('prices.loadingError')}
        message={t('prices.loadingErrorMessage')}
        onRetry={refetchLot}
      />
    );
  }

  if (!lotResponse?.data) {
    return (
      <EmptyState
        title={t('prices.notFound')}
        message={t('prices.notFoundMessage')}
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
