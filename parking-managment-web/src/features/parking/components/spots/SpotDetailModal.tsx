import type { SpotDTO } from '@parking/types';
import { ParkingService } from '@parking/services/parkingService';

interface Props {
  spot?: SpotDTO;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleAvailability?: (spotId: number, newStatus: boolean) => void;
  isToggling?: boolean;
}

export function SpotDetailModal({ 
  spot, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onToggleAvailability, 
  isToggling = false 
}: Props) {
  if (!isOpen || !spot) return null;

  const getVehicleTypeIcon = (vehicleType: string) => {
    return ParkingService.getVehicleIcon(vehicleType as any);
  };

  const formatVehicleType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
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
            {onToggleAvailability && (
              <button
                onClick={() => onToggleAvailability(spot.id, !spot.isAvailable)}
                disabled={isToggling}
                className={`
                  relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${spot.isAvailable ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                    ${spot.isAvailable ? 'translate-x-5' : 'translate-x-1'}
                  `}
                >
                  {isToggling && (
                    <div className="h-3 w-3 rounded-full bg-neutral-200 animate-pulse" />
                  )}
                </span>
              </button>
            )}
          </div>

          {/* Actions */}
          {(onEdit || onDelete) && (
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

