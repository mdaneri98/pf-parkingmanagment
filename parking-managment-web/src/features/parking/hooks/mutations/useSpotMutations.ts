import { useCallback } from 'react';
import {
  useCreateSpotMutation,
  useUpdateSpotMutation,
  useDeleteSpotMutation,
} from '@parking/api/parkingApi';
import { useNotification } from '@shared/contexts/NotificationContext';
import type { CreateSpotRequest, UpdateSpotRequest } from '@parking/types';
import { SUCCESS_MESSAGES, PARKING_CONSTANTS } from '@parking/constants/parking';
import { ErrorHandlingService } from '@parking/services/errorHandlingService';

export function useSpotMutations(lotId: number) {
  const { showNotification } = useNotification();
  
  const [createSpotMutation, createSpotState] = useCreateSpotMutation();
  const [updateSpotMutation, updateSpotState] = useUpdateSpotMutation();
  const [deleteSpotMutation, deleteSpotState] = useDeleteSpotMutation();

  const handleMutationError = useCallback((error: any, context: string) => {
    const parkingError = ErrorHandlingService.transformApiError(error, context);
    const userMessage = ErrorHandlingService.getUserFriendlyMessage(parkingError);
    
    ErrorHandlingService.logError(parkingError, { context, lotId });
    showNotification('error', userMessage, PARKING_CONSTANTS.NOTIFICATIONS.ERROR_DURATION);
  }, [showNotification, lotId]);

  const handleMutationSuccess = useCallback((message: string, callback?: () => void) => {
    showNotification('success', message, PARKING_CONSTANTS.NOTIFICATIONS.SUCCESS_DURATION);
    callback?.();
  }, [showNotification]);

  const createSpot = useCallback(async (
    lotId: number,
    data: CreateSpotRequest, 
    onSuccess?: () => void
  ) => {
    try {
      await createSpotMutation({ parkingLotId: lotId, body: data }).unwrap();
      handleMutationSuccess(SUCCESS_MESSAGES.SPOT.CREATED, onSuccess);
    } catch (error) {
      handleMutationError(error, 'createSpot');
    }
  }, [createSpotMutation, handleMutationSuccess, handleMutationError]);

  const updateSpot = useCallback(async (
    spotId: number,
    data: UpdateSpotRequest,
    onSuccess?: () => void
  ) => {
    try {
      await updateSpotMutation({ spotId, parkingLotId: lotId, body: data }).unwrap();
      handleMutationSuccess(SUCCESS_MESSAGES.SPOT.UPDATED, onSuccess);
    } catch (error) {
      handleMutationError(error, 'updateSpot');
    }
  }, [updateSpotMutation, lotId, handleMutationSuccess, handleMutationError]);

  const deleteSpot = useCallback(async (
    spotId: number,
    onSuccess?: () => void
  ) => {
    try {
      await deleteSpotMutation({ spotId, parkingLotId: lotId }).unwrap();
      handleMutationSuccess(SUCCESS_MESSAGES.SPOT.DELETED, onSuccess);
    } catch (error) {
      handleMutationError(error, 'deleteSpot');
    }
  }, [deleteSpotMutation, lotId, handleMutationSuccess, handleMutationError]);

  return {
    mutations: {
      createSpot,
      updateSpot,
      deleteSpot,
    },
    loadingStates: {
      createSpot: createSpotState.isLoading,
      updateSpot: updateSpotState.isLoading,
      deleteSpot: deleteSpotState.isLoading,
    },
  };
}
