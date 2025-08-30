
import type { SpotDTO } from '../types';

interface Props {
  spot: SpotDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SpotDetailModal({ spot, isOpen, onClose, onEdit, onDelete }: Props) {
  if (!isOpen || !spot) return null;

  const getVehicleTypeIcon = (vehicleType: string) => {
    const type = vehicleType.toLowerCase();
    switch (type) {
      case 'car':
        return '🚗';
      case 'motorcycle':
        return '🏍️';
      case 'truck':
        return '🚛';
      case 'van':
        return '🚐';
      case 'electric':
        return '⚡';
      default:
        return '🚗';
    }
  };

  const formatVehicleType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getVehicleTypeIcon(spot.vehicleType)}</div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Spot {spot.code}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Floor {spot.floor}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Status</span>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              spot.isAvailable 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}>
              <div className={`w-2 h-2 rounded-full ${spot.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{spot.isAvailable ? 'Available' : 'Occupied'}</span>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Vehicle Type</span>
            <span className="text-sm text-neutral-900 dark:text-neutral-100">
              {formatVehicleType(spot.vehicleType)}
            </span>
          </div>

          {/* Floor */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Floor</span>
            <span className="text-sm text-neutral-900 dark:text-neutral-100">
              Floor {spot.floor}
            </span>
          </div>

          {/* Spot ID */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Spot ID</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
              #{spot.id}
            </span>
          </div>

          {/* Actions */}
          {(onEdit || onDelete) && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex space-x-3">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-neutral-200 dark:border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
