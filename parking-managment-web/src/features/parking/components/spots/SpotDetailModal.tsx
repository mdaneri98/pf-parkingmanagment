import { useState, useEffect } from 'react';
import type { SpotDTO } from '@parking/types';
import { ParkingService } from '@parking/services/parkingService';
import {
  useWalkInStayMutations,
  useActiveWalkInStayForSpot,
  useGetRemainingTime,
  useWalkInStayModalState,
  WalkInStayForm,
  ExtendTimeForm,
  WalkInStayDetails,
  WALK_IN_STAY_CONSTANTS,
  formatDateTime,
  ReservationStatus,
} from '@walkinstays';
import type { WalkInStayFormData, WalkInStayResponse } from '@walkinstays/types';
import { CompletionSummary } from '@walkinstays/components/CompletionSummary';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';
import { Modal } from '@shared/ui/components';

interface Props {
  spot?: SpotDTO;
  lotId: number;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleAvailability?: (spotId: number, newStatus: boolean) => void;
  isToggling?: boolean;
  onRefetchSpot?: () => void;
}

export function SpotDetailModal({
                                  spot,
                                  lotId,
                                  isOpen,
                                  onClose,
                                  onEdit,
                                  onDelete,
                                  onToggleAvailability,
                                  isToggling = false,
                                  onRefetchSpot
                                }: Props) {
  if (!isOpen || !spot) return null;

  const { t } = useTypedTranslation();

  // Walk-in stay hooks
  const { mutations, loadingStates } = useWalkInStayMutations();
  const {
    data: activeWalkInStay,
  } = useActiveWalkInStayForSpot(spot.id, lotId);

  const { remainingMinutes } = useGetRemainingTime(activeWalkInStay?.id, {
    skip: !activeWalkInStay,
    pollingInterval: WALK_IN_STAY_CONSTANTS.POLLING.REMAINING_TIME_INTERVAL,
  });

  const { modalState, openModal, closeModal } = useWalkInStayModalState();

  const [completedStaySummary, setCompletedStaySummary] = useState<WalkInStayResponse | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCompletedStaySummary(null);
    }
  }, [isOpen]);

  const getVehicleTypeIcon = (vehicleType: string) => {
    return ParkingService.getVehicleIcon(vehicleType as any);
  };

  const formatVehicleType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleCloseModal = () => {
    setCompletedStaySummary(null);

    closeModal('createForm');
    closeModal('extendForm');
    closeModal('summary');

    onClose();
  };

  const handleCreateWalkInStay = async (formData: WalkInStayFormData) => {
    try {
      await mutations.createWalkInStay({
        spotId: spot.id,
        vehicleLicensePlate: formData.licensePlate,
        expectedDurationHours: formData.expectedHours,
      }, () => {
        closeModal('createForm');
        onRefetchSpot?.();
        handleCloseModal();
      }, lotId);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleExtendWalkInStay = async (extraHours: number) => {
    if (!activeWalkInStay) return;

    await mutations.extendWalkInStay(activeWalkInStay.id, extraHours, () => {
      closeModal('extendForm');
      onRefetchSpot?.();
    });
  };

  const handleCompleteWalkInStay = async () => {
    if (!activeWalkInStay) return;

    await mutations.updateWalkInStayStatus(
        activeWalkInStay.id,
        ReservationStatus.COMPLETED,
        (completedStayData: WalkInStayResponse) => {
          setCompletedStaySummary(completedStayData);

          openModal('summary');

          onRefetchSpot?.();
        }
    );
  };

  return (
      <Modal isOpen={isOpen} onClose={handleCloseModal} maxWidth="sm">
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full border border-neutral-200 dark:border-neutral-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getVehicleTypeIcon(spot.vehicleType)}</div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Spot {spot.code}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Floor {spot.floor} • {formatVehicleType(spot.vehicleType)}
                </p>
              </div>
            </div>
            <button
                onClick={handleCloseModal}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">

            {/* 1. COMPLETION SUMMARY (Prioridad 1) */}
            {modalState.summary && completedStaySummary && (
                <CompletionSummary
                    stay={completedStaySummary}
                    onClose={handleCloseModal}
                />
            )}

            {/* 2. WALK-IN STAY DETAILS (Prioridad 2) */}
            {!modalState.summary && activeWalkInStay && (
                <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                  {!modalState.extendForm ? (
                      <WalkInStayDetails
                          walkInStay={activeWalkInStay}
                          remainingMinutes={remainingMinutes}
                          onExtend={() => openModal('extendForm')}
                          onComplete={handleCompleteWalkInStay}
                          isExtending={loadingStates.extend}
                          isCompleting={loadingStates.updateStatus}
                      />
                  ) : (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">{t('walkinstays.extendTime')}</h3>
                        <ExtendTimeForm
                            onSubmit={handleExtendWalkInStay}
                            onCancel={() => closeModal('extendForm')}
                            isLoading={loadingStates.extend}
                            currentExpiry={formatDateTime(activeWalkInStay.expectedEndTime)}
                        />
                      </div>
                  )}
                </div>
            )}

            {/* 3. CREATE FORM (Prioridad 3) */}
            {!modalState.summary && spot.isAvailable && !modalState.createForm && !activeWalkInStay && (
                <div className="space-y-3">
                  <button
                      onClick={() => openModal('createForm')}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    {t('walkinstays.createWalkInStay')}
                  </button>
                </div>
            )}

            {modalState.createForm && (
                <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">{t('walkinstays.createWalkInStay')}</h3>
                  <WalkInStayForm
                      onSubmit={handleCreateWalkInStay}
                      onCancel={() => closeModal('createForm')}
                      isLoading={loadingStates.createWalkInStay}
                  />
                </div>
            )}

            {/* Actions (Edit/Delete) (Prioridad 4) */}
            {(onEdit || onDelete) && !modalState.summary && !modalState.createForm && !activeWalkInStay && (
                <div className="flex space-x-2 pt-2">
                  {onEdit && (
                      <button
                          onClick={onEdit}
                          className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                      >
                        {t('common.edit')}
                      </button>
                  )}
                  {onDelete && (
                      <button
                          onClick={onDelete}
                          className="flex-1 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                      >
                        {t('common.delete')}
                      </button>
                  )}
                </div>
            )}
          </div>
        </div>
      </Modal>
  );
}