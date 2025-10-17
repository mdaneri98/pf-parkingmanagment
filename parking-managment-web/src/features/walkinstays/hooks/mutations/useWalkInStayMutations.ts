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
import {
  WALK_IN_STAY_SUCCESS_MESSAGES,
  WALK_IN_STAY_ERROR_MESSAGES,
} from '@walkinstays/constants/walkInStays';
import { useNotification } from '@shared/contexts';

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

        showNotification('success', WALK_IN_STAY_SUCCESS_MESSAGES.CREATED);

        onSuccess?.(response.data);
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          error?.data?.message ||
          WALK_IN_STAY_ERROR_MESSAGES.CREATE_FAILED;

        showNotification('error', errorMessage);

        throw error;
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
            ? WALK_IN_STAY_SUCCESS_MESSAGES.COMPLETED
            : WALK_IN_STAY_SUCCESS_MESSAGES.STATUS_UPDATED;

        showNotification('success', successMessage);

        onSuccess?.(response.data);
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          error?.data?.message ||
          (status === 'COMPLETED'
            ? WALK_IN_STAY_ERROR_MESSAGES.COMPLETE_FAILED
            : WALK_IN_STAY_ERROR_MESSAGES.STATUS_UPDATE_FAILED);

        showNotification('error', errorMessage);

        throw error;
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

        showNotification('success', WALK_IN_STAY_SUCCESS_MESSAGES.EXTENDED);

        onSuccess?.(response.data);
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          error?.data?.message ||
          WALK_IN_STAY_ERROR_MESSAGES.EXTEND_FAILED;

        showNotification('error', errorMessage);

        throw error;
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

