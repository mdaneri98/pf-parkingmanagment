import { ParkingLotSettingsModal, CreateParkingLotModal } from '@parking/components/lots';
import type {
  UpdateParkingLotRequest,
  ParkingLotResponse,
  CreateParkingLotRequest
} from '@parking/types';

interface ModalState {
  modals: {
    lotSettings: boolean;
    createLot: boolean;
  };
  confirmDelete: { type: 'lot'; id: number } | null;
  openModal: (modal: keyof ModalState['modals']) => void;
  closeModal: (modal: keyof ModalState['modals']) => void;
  setConfirmDelete: (data: { type: 'lot'; id: number } | null) => void;
}

interface LoadingStates {
  updateLot: boolean;
  deleteLot: boolean;
  createLot: boolean;
}

interface SettingsModalsProps {
  modalState: ModalState;
  lotData?: ParkingLotResponse;
  loadingStates: LoadingStates;
  onUpdateLot: (data: UpdateParkingLotRequest) => void;
  onDeleteLot: () => void;
  onCreateLot: (data: CreateParkingLotRequest) => void;
}

export function SettingsModals({
  modalState,
  lotData,
  loadingStates,
  onUpdateLot,
  onDeleteLot,
  onCreateLot,
}: SettingsModalsProps) {
  return (
    <>
      {/* Parking Lot Settings Modal */}
      <ParkingLotSettingsModal
        isOpen={modalState.modals.lotSettings}
        onClose={() => modalState.closeModal('lotSettings')}
        onSubmit={onUpdateLot}
        parkingLot={lotData}
        isLoading={loadingStates.updateLot}
      />

      {/* Create Parking Lot Modal */}
      <CreateParkingLotModal
        isOpen={modalState.modals.createLot}
        onClose={() => modalState.closeModal('createLot')}
        onSubmit={onCreateLot}
        isLoading={loadingStates.createLot}
      />

      {/* Delete Confirmation Modal */}
      {modalState.confirmDelete && (
        <ConfirmDeleteLotModal
          isOpen={true}
          onConfirm={onDeleteLot}
          onCancel={() => modalState.setConfirmDelete(null)}
          isLoading={loadingStates.deleteLot}
        />
      )}
    </>
  );
}

// Confirmation Modal Component for parking lot deletion
interface ConfirmDeleteLotModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ConfirmDeleteLotModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading
}: ConfirmDeleteLotModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Delete Parking Lot
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Are you sure you want to delete this parking lot? This action cannot be undone and will remove all associated spots.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
