import { useState, useRef, useEffect } from 'react';
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
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';
import type { CreateParkingLotRequest, UpdateParkingLotRequest } from '@parking/types';

export function ParkingLotManagement() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTypedTranslation();
  const selectedLotId = useAppSelector(selectSelectedParkingLotId);
  const isLoading = useAppSelector(selectParkingLotsLoading);
  const isError = useAppSelector(selectParkingLotsError);
  const user = useAppSelector(selectAuthUser);
  
  const lotId = params.lotId ? Number(params.lotId) : selectedLotId;
  const isValidLot = Boolean(lotId && !isNaN(lotId));

  const { 
    data: parkingLotsResponse, 
    isLoading: isLotsLoading, 
    isError: isLotsError,
    refetch: refetchLots
  } = useGetParkingLotsByUserIdQuery(user?.id!, {
    skip: !user?.id,
  });

  const parkingLots = parkingLotsResponse?.data || [];
  
  // Split parking lots into selected and others
  const selectedLot = parkingLots.find(lot => lot.id === selectedLotId);
  const otherLots = parkingLots.filter(lot => lot.id !== selectedLotId);
  
  const modalState = useSettingsModalState();
  const { mutations, loadingStates } = useParkingLotMutations();
  
  // State for dropdown menu
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Early returns for invalid states
  if (!user?.id) {
    return (
      <EmptyState
        title={t('settings.parkingLots.authenticationRequired')}
        message={t('settings.parkingLots.authenticationMessage')}
      />
    );
  }

  if (isLotsLoading) {
    return <LoadingState />;
  }

  if (isLotsError) {
    return (
      <ErrorState
        title={t('settings.parkingLots.loadingError')}
        message={t('settings.parkingLots.loadingErrorMessage')}
        onRetry={refetchLots}
      />
    );
  }

  if (!parkingLots.length) {
    return (
      <EmptyState
        title={t('settings.parkingLots.noLotsTitle')}
        message={t('settings.parkingLots.noLotsMessage')}
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
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {t('settings.parkingLots.title')}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                {t('settings.parkingLots.description')}
              </p>
            </div>
            
            <Button
              onClick={() => modalState.openModal('createLot')}
              disabled={loadingStates.createLot}
              className="btn-primary shrink-0"
            >
              {loadingStates.createLot ? t('settings.parkingLots.creating') : t('settings.parkingLots.newParkingLot')}
            </Button>
          </div>

          {/* Featured Parking Lot (Selected) */}
          {selectedLot && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 text-center">
                {t('settings.parkingLots.currentLot')}
              </h3>
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {renderParkingLotCard(selectedLot, true)}
                </div>
              </div>
            </div>
          )}

          {/* Other Parking Lots */}
          {otherLots.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                {selectedLot ? t('settings.parkingLots.additionalLots') : t('settings.parkingLots.allLots')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {otherLots.map((lotData) => (
                  renderParkingLotCard(lotData, false)
                ))}
              </div>
            </div>
          )}

          {/* Fallback: Show all lots if no selected lot */}
          {!selectedLot && parkingLots.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {parkingLots.map((lotData) => (
                renderParkingLotCard(lotData, false)
              ))}
            </div>
          )}
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

  // Helper function to render parking lot cards
  function renderParkingLotCard(lotData: any, isFeatured: boolean) {
    return (
      <div 
        key={lotData.id} 
        className={`group relative bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 cursor-pointer w-full ${
          isFeatured ? 'shadow-xl border-primary-200 dark:border-primary-700' : ''
        }`}
        onClick={() => modalState.openModal('lotSettings', lotData)}
      >
        {/* Three-dot Menu Button */}
        <div className="absolute top-4 right-4" ref={(el) => { menuRefs.current[lotData.id] = el; }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === lotData.id ? null : lotData.id);
            }}
            className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            title={t('settings.parkingLots.moreOptions')}
          >
            <svg className="w-5 h-5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {openMenuId === lotData.id && (
            <div className="absolute right-0 top-8 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(null);
                    modalState.setConfirmDelete({ type: 'lot', id: lotData.id });
                  }}
                  disabled={loadingStates.deleteLot}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {t('settings.parkingLots.deleteLot')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Configure Icon (appears on hover) */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary-500 text-white p-2 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Image Preview */}
        {lotData.imageUrl ? (
          <div className="flex justify-center mb-4">
            <div className={`relative rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300 ${
              isFeatured ? 'w-32 h-32' : 'w-24 h-24'
            }`}>
              <ImagePreview
                src={lotData.imageUrl}
                alt={lotData.name}
                size="md"
                clickable={false}
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className={`rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center ${
              isFeatured ? 'w-32 h-32' : 'w-24 h-24'
            }`}>
              <svg className={`text-neutral-400 ${isFeatured ? 'w-10 h-10' : 'w-8 h-8'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        )}

        {/* Lot Information */}
        <div className="text-center mb-6">
          <h3 className={`font-semibold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 ${
            isFeatured ? 'text-xl' : 'text-lg'
          }`}>
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

        {/* Hover Overlay */}
        <div className="absolute inset-0 rounded-xl bg-primary-500 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 pointer-events-none" />
      </div>
    );
  }
}
