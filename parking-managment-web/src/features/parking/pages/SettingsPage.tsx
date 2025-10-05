import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { 
  selectSelectedParkingLotId,
  selectParkingLotsLoading,
  selectParkingLotsError
} from '@parking/selectors/parkingLotSelectors';
import { selectAuthUser } from '@auth/selectors';
import { setSelectedParkingLotId } from '@parking/slice/parkingSlice';
import { useGetParkingLotsByUserIdQuery } from '@parking/api/parkingApi';
import { useSettingsModalState } from '@parking/hooks/state/useSettingsModalState';
import { useParkingLotMutations } from '@parking/hooks/mutations/useParkingLotMutations';
import { LoadingState, ErrorState, EmptyState } from '@parking/components/common';
import { SettingsModals } from '@parking/components/settings/SettingsModals';
import { ImagePreview } from '@shared/components/ImagePreview';
import { Button } from '@shared/ui/components';
import type { CreateParkingLotRequest, UpdateParkingLotRequest } from '@parking/types';

export function SettingsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedLotId = useAppSelector(selectSelectedParkingLotId);
  const isLoading = useAppSelector(selectParkingLotsLoading);
  const isError = useAppSelector(selectParkingLotsError);
  const user = useAppSelector(selectAuthUser);
  
  const lotId = params.lotId ? Number(params.lotId) : selectedLotId;
  const isValidLot = Boolean(lotId && !isNaN(lotId));

  // Sync URL with Redux store
  if (isValidLot && selectedLotId !== lotId) {
    dispatch(setSelectedParkingLotId(lotId));
  }

  const { 
    data: parkingLotsResponse, 
    isLoading: isLotsLoading, 
    isError: isLotsError,
    refetch: refetchLots
  } = useGetParkingLotsByUserIdQuery(user?.id!, {
    skip: !user?.id,
  });

  const parkingLots = parkingLotsResponse?.data || [];
  
  console.log('SettingsPage Debug:', {
    userId: user?.id,
    parkingLots,
    isLoading,
    isError
  });

  const modalState = useSettingsModalState();
  const { mutations, loadingStates } = useParkingLotMutations();

  const handleCreateLot = async (data: CreateParkingLotRequest) => {
    await mutations.createLot(data, (createdLot) => {
      modalState.closeModal('createLot');
      navigate(`/app/dashboard/${createdLot.id}`);
    });
  };

  const handleUpdateLot = async (data: UpdateParkingLotRequest) => {
    if (!modalState.currentLot?.id) return;
    
    await mutations.updateLot(modalState.currentLot.id, data, () => {
      modalState.closeModal('lotSettings');
    });
  };

  const handleDeleteLot = async (lotIdToDelete: number) => {
    await mutations.deleteLot(lotIdToDelete, () => {
      modalState.setConfirmDelete(null);
    });
  };

  // Early returns for invalid states
  if (!user?.id) {
    return (
      <EmptyState
        title="Authentication Required"
        message="Please log in to manage your parking lots."
      />
    );
  }

  if (isLotsLoading) {
    return <LoadingState />;
  }

  if (isLotsError) {
    return (
      <ErrorState
        title="Failed to Load Parking Lots"
        message="Unable to fetch parking lot data. Please check your connection and try again."
        onRetry={refetchLots}
      />
    );
  }

  if (!parkingLots.length) {
    return (
      <EmptyState
        title="No Parking Lots"
        message="You don't have any parking lots yet. Create your first one to get started."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="card-elevated">
        <div className="card-body">
          {/* Header with Actions */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Parking Lot Settings
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Manage your parking lot information and create new locations
              </p>
            </div>
            
            <Button
              onClick={() => modalState.openModal('createLot')}
              disabled={loadingStates.createLot}
              className="btn-primary shrink-0"
            >
              {loadingStates.createLot ? 'Creating...' : 'New Parking Lot'}
            </Button>
          </div>

          {/* Parking Lots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {parkingLots.map((lotData) => (
              <div 
                key={lotData.id} 
                className="group relative bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 cursor-pointer w-full"
                onClick={() => navigate(`/app/dashboard/${lotData.id}`)}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </div>

                {/* Image Preview */}
                {lotData.imageUrl ? (
                  <div className="flex justify-center mb-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      <ImagePreview
                        src={lotData.imageUrl}
                        alt={lotData.name}
                        size="md"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                      <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Lot Information */}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {lotData.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                    {lotData.address}
                  </p>
                  
                  {lotData.coordinates && (
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="inline-flex items-center justify-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {lotData.coordinates.latitude.toFixed(4)}, {lotData.coordinates.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      modalState.openModal('lotSettings', lotData);
                    }}
                    disabled={loadingStates.updateLot}
                    className="btn-primary flex-1 text-sm py-2"
                    size="sm"
                  >
                    Edit
                  </Button>
                  
                  <Button
                    variant="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      modalState.setConfirmDelete({ type: 'lot', id: lotData.id });
                    }}
                    disabled={loadingStates.deleteLot}
                    loading={loadingStates.deleteLot}
                    className="text-sm py-2 px-3"
                    size="sm"
                    title="Delete parking lot"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 rounded-xl bg-primary-500 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Modals */}
      <SettingsModals
        modalState={modalState}
        lotData={modalState.currentLot ?? undefined}
        loadingStates={loadingStates}
        onUpdateLot={handleUpdateLot}
        onDeleteLot={() => {
          if (modalState.confirmDelete?.id) {
            handleDeleteLot(modalState.confirmDelete.id);
          }
        }}
        onCreateLot={handleCreateLot}
      />

    </div>
  );
}