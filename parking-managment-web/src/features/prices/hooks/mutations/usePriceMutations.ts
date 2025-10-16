import { useCallback } from 'react';
import { 
  useCreatePriceMutation,
  useUpdatePriceMutation,
  useDeletePriceMutation,
} from '@prices/api/pricesApi';
import type { 
  PriceFormData, 
  PriceMutationLoadingStates,
  PriceResult,
  ParkingPriceResponse,
} from '@prices/types';
import { 
  formDataToApiRequest,
  validatePriceFormData,
  findOverlappingPrices,
} from '@prices/utils/priceUtils';
import { 
  PRICE_SUCCESS_MESSAGES, 
  PRICE_ERROR_MESSAGES,
} from '@prices/constants/prices';
import { useNotification } from '@shared/contexts';

interface UsePriceMutationsOptions {
  parkingLotId: number;
  existingPrices?: ParkingPriceResponse[];
  onSuccess?: (action: 'create' | 'update' | 'delete', data?: ParkingPriceResponse) => void;
  onError?: (action: 'create' | 'update' | 'delete', error: any) => void;
}

export const usePriceMutations = ({
  parkingLotId,
  existingPrices = [],
  onSuccess,
  onError,
}: UsePriceMutationsOptions) => {
  const { showNotification } = useNotification();
  
  // RTK Query mutations
  const [createPriceMutation, { isLoading: isCreating }] = useCreatePriceMutation();
  const [updatePriceMutation, { isLoading: isUpdating }] = useUpdatePriceMutation();
  const [deletePriceMutation, { isLoading: isDeleting }] = useDeletePriceMutation();

  // Loading states
  const loadingStates: PriceMutationLoadingStates = {
    createPrice: isCreating,
    updatePrice: isUpdating,
    deletePrice: isDeleting,
    isAnyLoading: isCreating || isUpdating || isDeleting,
  };

  // Create price
  const createPrice = useCallback(async (
    formData: PriceFormData,
    options: { validateOverlap?: boolean } = { validateOverlap: true }
  ): Promise<PriceResult<ParkingPriceResponse>> => {
    try {
      // Validate form data
      const validation = validatePriceFormData(formData);
      if (!validation.isValid) {
        const errorMessage = validation.errors.map(e => e.message).join(', ');
        throw new Error(errorMessage);
      }

      // Check for overlapping periods if requested
      if (options.validateOverlap) {
        const apiRequest = formDataToApiRequest(formData);
        const overlapping = findOverlappingPrices(existingPrices, {
          validFrom: apiRequest.validFrom,
          validTo: apiRequest.validTo,
          vehicleType: apiRequest.vehicleType,
        });

        if (overlapping.length > 0) {
          throw new Error(PRICE_ERROR_MESSAGES.VALIDATION.OVERLAPPING_PERIOD);
        }
      }

      // Convert form data to API format
      const apiRequest = formDataToApiRequest(formData);

      // Make API call
      const response = await createPriceMutation({
        parkingLotId,
        body: apiRequest,
      }).unwrap();

      showNotification('success', PRICE_SUCCESS_MESSAGES.PRICE.CREATED);

      // Call success callback
      onSuccess?.('create', response.data);

      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error?.message || PRICE_ERROR_MESSAGES.PRICE.CREATE_FAILED;
      
      showNotification('error', errorMessage);

      // Call error callback
      onError?.('create', error);

      return { 
        success: false, 
        error: { 
          name: 'PriceError',
          message: errorMessage,
          code: 'CREATE_FAILED',
        } as any,
      };
    }
  }, [parkingLotId, existingPrices, createPriceMutation, showNotification, onSuccess, onError]);

  // Update price
  const updatePrice = useCallback(async (
    priceId: number,
    formData: PriceFormData,
    options: { validateOverlap?: boolean } = { validateOverlap: true }
  ): Promise<PriceResult<ParkingPriceResponse>> => {
    try {
      // Validate form data
      const validation = validatePriceFormData(formData);
      if (!validation.isValid) {
        const errorMessage = validation.errors.map(e => e.message).join(', ');
        throw new Error(errorMessage);
      }

      // Check for overlapping periods if requested (excluding the current price)
      if (options.validateOverlap) {
        const apiRequest = formDataToApiRequest(formData);
        const overlapping = findOverlappingPrices(existingPrices, {
          validFrom: apiRequest.validFrom,
          validTo: apiRequest.validTo,
          vehicleType: apiRequest.vehicleType,
        }, priceId);

        if (overlapping.length > 0) {
          throw new Error(PRICE_ERROR_MESSAGES.VALIDATION.OVERLAPPING_PERIOD);
        }
      }

      // Convert form data to API format
      const apiRequest = formDataToApiRequest(formData);

      // Make API call
      const response = await updatePriceMutation({
        parkingLotId,
        priceId,
        body: apiRequest,
      }).unwrap();

      // Show success notification
      showNotification('success', PRICE_SUCCESS_MESSAGES.PRICE.UPDATED);

      // Call success callback
      onSuccess?.('update', response.data);

      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error?.message || PRICE_ERROR_MESSAGES.PRICE.UPDATE_FAILED;
      
      // Show error notification
      showNotification('error', errorMessage);

      // Call error callback
      onError?.('update', error);

      return { 
        success: false, 
        error: { 
          name: 'PriceError',
          message: errorMessage,
          code: 'UPDATE_FAILED',
        } as any,
      };
    }
  }, [parkingLotId, existingPrices, updatePriceMutation, showNotification, onSuccess, onError]);

  // Delete price
  const deletePrice = useCallback(async (priceId: number): Promise<PriceResult<void>> => {
    try {
      // Make API call
      await deletePriceMutation({
        parkingLotId,
        priceId,
      }).unwrap();

      // Show success notification
      showNotification('info', PRICE_SUCCESS_MESSAGES.PRICE.DELETED);

      // Call success callback
      onSuccess?.('delete');

      return { success: true, data: undefined };
    } catch (error: any) {
      const errorMessage = error?.message || PRICE_ERROR_MESSAGES.PRICE.DELETE_FAILED;
      
      // Show error notification
      showNotification('error', errorMessage);

      // Call error callback
      onError?.('delete', error);

      return { 
        success: false, 
        error: { 
          name: 'PriceError',
          message: errorMessage,
          code: 'DELETE_FAILED',
        } as any,
      };
    }
  }, [parkingLotId, deletePriceMutation, showNotification, onSuccess, onError]);

  return {
    // Mutations
    createPrice,
    updatePrice,
    deletePrice,
    
    // Loading states
    loadingStates,
    
    // Individual loading flags
    isCreating,
    isUpdating,
    isDeleting,
    isAnyLoading: loadingStates.isAnyLoading,
  };
};
