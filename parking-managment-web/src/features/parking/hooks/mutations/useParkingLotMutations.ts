import { useCallback } from 'react';
import {
  useCreateParkingLotMutation,
  useUpdateParkingLotMutation,
  useDeleteParkingLotMutation,
} from '@parking/api/parkingApi';
import { useNotification } from '@shared/contexts/NotificationContext';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { setSelectedParkingLotId } from '@parking/slice/parkingSlice';
import { selectSelectedParkingLotId } from '@parking/selectors/parkingLotSelectors';
import type { CreateParkingLotRequest, UpdateParkingLotRequest, ParkingLotResponse } from '@parking/types';
import { SUCCESS_MESSAGES, PARKING_CONSTANTS } from '@parking/constants/parking';
import { ErrorHandlingService } from '@parking/services/errorHandlingService';

export function useParkingLotMutations() {
  const { showNotification } = useNotification();
  const dispatch = useAppDispatch();
  const selectedLotId = useAppSelector(selectSelectedParkingLotId);
  
  const [createLotMutation, createLotState] = useCreateParkingLotMutation();
  const [updateLotMutation, updateLotState] = useUpdateParkingLotMutation();
  const [deleteLotMutation, deleteLotState] = useDeleteParkingLotMutation();

  const handleMutationError = useCallback((error: any, context: string) => {
    const parkingError = ErrorHandlingService.transformApiError(error, context);
    const userMessage = ErrorHandlingService.getUserFriendlyMessage(parkingError);
    
    ErrorHandlingService.logError(parkingError, { context });
    showNotification('error', userMessage, PARKING_CONSTANTS.NOTIFICATIONS.ERROR_DURATION);
  }, [showNotification]);

  const handleMutationSuccess = useCallback((message: string, callback?: () => void) => {
    showNotification('success', message, PARKING_CONSTANTS.NOTIFICATIONS.SUCCESS_DURATION);
    callback?.();
  }, [showNotification]);

  const createLot = useCallback(async (
    data: CreateParkingLotRequest, 
    onSuccess?: (createdLot: ParkingLotResponse) => void
  ) => {
    try {
      const response = await createLotMutation(data).unwrap();
      const createdLot = response.data;
      handleMutationSuccess(SUCCESS_MESSAGES.LOT.CREATED, () => onSuccess?.(createdLot));
    } catch (error) {
      handleMutationError(error, 'createParkingLot');
    }
  }, [createLotMutation, handleMutationSuccess, handleMutationError]);

  const updateLot = useCallback(async (
    lotId: number,
    data: UpdateParkingLotRequest,
    onSuccess?: () => void
  ) => {
    try {
      await updateLotMutation({ id: lotId, body: data }).unwrap();
      handleMutationSuccess(SUCCESS_MESSAGES.LOT.UPDATED, onSuccess);
    } catch (error) {
      handleMutationError(error, 'updateParkingLot');
    }
  }, [updateLotMutation, handleMutationSuccess, handleMutationError]);

  const deleteLot = useCallback(async (
    lotId: number,
    onSuccess?: () => void
  ) => {
    try {
      await deleteLotMutation(lotId).unwrap();
      
      // If the deleted lot was the selected one, clear the selection
      if (selectedLotId === lotId) {
        dispatch(setSelectedParkingLotId(null));
      }
      
      handleMutationSuccess(SUCCESS_MESSAGES.LOT.DELETED, onSuccess);
    } catch (error) {
      handleMutationError(error, 'deleteParkingLot');
    }
  }, [deleteLotMutation, selectedLotId, dispatch, handleMutationSuccess, handleMutationError]);

  return {
    mutations: {
      createLot,
      updateLot,
      deleteLot,
    },
    loadingStates: {
      createLot: createLotState.isLoading,
      updateLot: updateLotState.isLoading,
      deleteLot: deleteLotState.isLoading,
    },
  };
}
