import { useEffect } from 'react';
import { useGetParkingLotByIdQuery } from '@parking/api/parkingApi';
import { PARKING_CONSTANTS } from '@parking/constants/parking';
import { useNotification } from '@shared/contexts/NotificationContext';
import { useErrorHandler } from '@shared/utils/errorHandling';

export function useParkingLotData(lotId: number) {
  const { showNotification } = useNotification();
  const { getUserFriendlyMessage } = useErrorHandler();
  
  const query = useGetParkingLotByIdQuery(lotId, {
    pollingInterval: PARKING_CONSTANTS.POLLING.DASHBOARD_INTERVAL,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !lotId || isNaN(lotId),
  });

  // Show error notification when parking lot data fails to load
  useEffect(() => {
    if (query.isError && query.error) {
      const errorMessage = getUserFriendlyMessage(query.error);
      showNotification('error', `Failed to load parking lot: ${errorMessage}`);
    }
  }, [query.isError, query.error, showNotification, getUserFriendlyMessage]);

  return {
    lot: query.data?.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
