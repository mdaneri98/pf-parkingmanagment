import { useCallback } from 'react';
import {
  useCreateSpotMutation,
  useUpdateSpotMutation,
  useDeleteSpotMutation,
} from '@parking/api/parkingApi';
import { useNotification } from '@shared/contexts/NotificationContext';
import type { CreateSpotRequest, UpdateSpotRequest } from '@parking/types';
import { SUCCESS_MESSAGE_KEYS, PARKING_CONSTANTS } from '@parking/constants/parking';
import { AppErrorHandler } from '@shared/utils/errorHandling';
import i18n from '@shared/i18n/config';

export function useSpotMutations(lotId: number) {
  const { showNotification } = useNotification();
  
  const [createSpotMutation, createSpotState] = useCreateSpotMutation();
  const [updateSpotMutation, updateSpotState] = useUpdateSpotMutation();
  const [deleteSpotMutation, deleteSpotState] = useDeleteSpotMutation();

  const handleMutationError = useCallback((error: any, context: string) => {
    const appError = AppErrorHandler.transformApiError(error, context);
    const userMessage = AppErrorHandler.getUserFriendlyMessage(appError);
    
    AppErrorHandler.handleError(appError, { context, lotId });
    showNotification('error', userMessage, PARKING_CONSTANTS.NOTIFICATIONS.ERROR_DURATION);
  }, [showNotification, lotId]);

  const handleMutationSuccess = useCallback((message: string, callback?: () => void) => {
    showNotification('success', message, PARKING_CONSTANTS.NOTIFICATIONS.SUCCESS_DURATION);
    callback?.();
  }, [showNotification]);

  const handleDeleteSuccess = useCallback((message: string, callback?: () => void) => {
    showNotification('info', message, PARKING_CONSTANTS.NOTIFICATIONS.SUCCESS_DURATION);
    callback?.();
  }, [showNotification]);

  const createSpot = useCallback(async (
    lotId: number,
    data: CreateSpotRequest, 
    onSuccess?: () => void
  ) => {
    try {
      await createSpotMutation({ parkingLotId: lotId, body: data }).unwrap();
      handleMutationSuccess(i18n.t(SUCCESS_MESSAGE_KEYS.SPOT.CREATED), onSuccess);
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
      handleMutationSuccess(i18n.t(SUCCESS_MESSAGE_KEYS.SPOT.UPDATED), onSuccess);
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
      handleDeleteSuccess(i18n.t(SUCCESS_MESSAGE_KEYS.SPOT.DELETED), onSuccess);
    } catch (error) {
      handleMutationError(error, 'deleteSpot');
    }
  }, [deleteSpotMutation, lotId, handleDeleteSuccess, handleMutationError]);

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
