import { useCallback } from 'react';
import {
  useCreateWalkInStayMutation,
  useUpdateWalkInStayStatusMutation,
  useExtendWalkInStayMutation,
} from '@walkinstays/api/walkInStayApi';
import type {
  WalkInStayRequest,
  WalkInStayMutationLoadingStates,
  ReservationStatus,
  WalkInStayResponse,
} from '@walkinstays/types';
import { useNotification } from '@shared/contexts';
import { AppErrorHandler } from '@shared/utils/errorHandling';
import i18n from '@shared/i18n/config';

/**
 * Hook for managing walk-in stay mutations with notifications and error handling
 */
export const useWalkInStayMutations = () => {
  const { showNotification } = useNotification();

  // RTK Query mutations
  const [createWalkInStayMutation, { isLoading: isCreating }] = useCreateWalkInStayMutation();
  const [updateStatusMutation, { isLoading: isUpdatingStatus }] = useUpdateWalkInStayStatusMutation();
  const [extendMutation, { isLoading: isExtending }] = useExtendWalkInStayMutation();

  // Loading states
  const loadingStates: WalkInStayMutationLoadingStates = {
    createWalkInStay: isCreating,
    updateStatus: isUpdatingStatus,
    extend: isExtending,
    isAnyLoading: isCreating || isUpdatingStatus || isExtending,
  };

  /**
   * Create a new walk-in stay
   */
  const createWalkInStay = useCallback(
    async (
      request: WalkInStayRequest,
      onSuccess?: (data: WalkInStayResponse) => void,
      parkingLotId?: number
    ): Promise<void> => {
      try {
        const response = await createWalkInStayMutation({
          body: request,
          parkingLotId: parkingLotId || 0, // Used for cache invalidation
        }).unwrap();

        showNotification('success', i18n.t('walkinstays.success.created'));

        onSuccess?.(response.data);
      } catch (error: any) {
        const appError = AppErrorHandler.transformApiError(error, 'createWalkInStay');
        const errorMessage = AppErrorHandler.getUserFriendlyMessage(appError);
        
        showNotification('error', errorMessage);
        throw appError;
      }
    },
    [createWalkInStayMutation, showNotification]
  );

  /**
   * Update walk-in stay status
   */
  const updateWalkInStayStatus = useCallback(
    async (
      id: number,
      status: ReservationStatus,
      onSuccess?: (data: WalkInStayResponse) => void
    ): Promise<void> => {
      try {
        const response = await updateStatusMutation({
          id,
          status,
        }).unwrap();

        const successMessage =
          status === 'COMPLETED'
            ? i18n.t('walkinstays.success.completed')
            : i18n.t('walkinstays.success.statusUpdated');

        showNotification('success', successMessage);

        onSuccess?.(response.data);
      } catch (error: any) {
        const appError = AppErrorHandler.transformApiError(error, 'updateWalkInStayStatus');
        const errorMessage = AppErrorHandler.getUserFriendlyMessage(appError);
        
        showNotification('error', errorMessage);
        throw appError;
      }
    },
    [updateStatusMutation, showNotification]
  );

  /**
   * Extend walk-in stay duration
   */
  const extendWalkInStay = useCallback(
    async (
      id: number,
      extraHours: number,
      onSuccess?: (data: WalkInStayResponse) => void
    ): Promise<void> => {
      try {
        const response = await extendMutation({
          id,
          extraHours,
        }).unwrap();

        showNotification('success', i18n.t('walkinstays.success.extended'));

        onSuccess?.(response.data);
      } catch (error: any) {
        const appError = AppErrorHandler.transformApiError(error, 'extendWalkInStay');
        const errorMessage = AppErrorHandler.getUserFriendlyMessage(appError);
        
        showNotification('error', errorMessage);
        throw appError;
      }
    },
    [extendMutation, showNotification]
  );

  return {
    mutations: {
      createWalkInStay,
      updateWalkInStayStatus,
      extendWalkInStay,
    },
    loadingStates,
  };
};

