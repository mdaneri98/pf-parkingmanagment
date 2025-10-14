import { useState, useMemo } from 'react';
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
  UI_LABELS,
  formatDateTime,
  ReservationStatus,
} from '@walkinstays';
import type { WalkInStayFormData } from '@walkinstays/types';

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

  // Walk-in stay hooks
  const { mutations, loadingStates } = useWalkInStayMutations();
  const { data: activeWalkInStay } = useActiveWalkInStayForSpot(spot.id, lotId);
  const { remainingMinutes } = useGetRemainingTime(activeWalkInStay?.id, {
    skip: !activeWalkInStay,
    pollingInterval: WALK_IN_STAY_CONSTANTS.POLLING.REMAINING_TIME_INTERVAL,
  });
  const { modalState, openModal, closeModal } = useWalkInStayModalState();

  const getVehicleTypeIcon = (vehicleType: string) => {
    return ParkingService.getVehicleIcon(vehicleType as any);
  };

  const formatVehicleType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
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
        onClose();
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

    await mutations.updateWalkInStayStatus(activeWalkInStay.id, ReservationStatus.COMPLETED, () => {
      onRefetchSpot?.();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-sm w-full border border-neutral-200 dark:border-neutral-700">
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
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${spot.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {spot.isAvailable ? 'Available' : 'Occupied'}
              </span>
            </div>

          </div>

          {/* Walk-in Stay Section */}
          {spot.isAvailable && !modalState.createForm && !activeWalkInStay && (
            <div className="space-y-3">
              <button
                onClick={() => openModal('createForm')}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
              >
                {UI_LABELS.CREATE_WALK_IN_STAY}
              </button>
            </div>
          )}

          {/* Walk-in Stay Form */}
          {modalState.createForm && (
            <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">{UI_LABELS.CREATE_WALK_IN_STAY}</h3>
              <WalkInStayForm
                onSubmit={handleCreateWalkInStay}
                onCancel={() => closeModal('createForm')}
                isLoading={loadingStates.createWalkInStay}
              />
            </div>
          )}

          {/* Active Walk-in Stay Details */}
          {activeWalkInStay && (
            <div className="space-y-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
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
                  <h3 className="text-sm font-medium text-green-900 dark:text-green-100">{UI_LABELS.EXTEND_TIME}</h3>
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

          {/* Actions */}
          {(onEdit || onDelete) && !modalState.createForm && !activeWalkInStay && !modalState.extendForm && (
              <div className="flex space-x-2 pt-2">
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                      Edit
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="flex-1 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                      Delete
                    </button>
                )}
              </div>
          )}
        </div>
      </div>
    </div>
  );
}