import { useEffect, useCallback, useReducer } from 'react';
import type { SpotDTO, UpdateSpotRequest } from '@parking/types';
import { VEHICLE_TYPES, getVehicleTypeOptions, type VehicleType } from '@shared/constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, spotData: UpdateSpotRequest) => void;
  spot?: SpotDTO;
  isLoading: boolean;
}

type FormState = {
  floor: number | undefined;
  code: string;
  vehicleType: VehicleType;
  isAvailable: boolean;
};

type FormAction =
  | { type: 'SET_CODE'; payload: string }
  | { type: 'SET_FLOOR'; payload: number | undefined }
  | { type: 'SET_VEHICLE'; payload: VehicleType }
  | { type: 'SET_AVAILABILITY'; payload: boolean }
  | { type: 'RESET'; payload: FormState };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_CODE': return { ...state, code: action.payload };
    case 'SET_FLOOR': return { ...state, floor: action.payload };
    case 'SET_VEHICLE': return { ...state, vehicleType: action.payload };
    case 'SET_AVAILABILITY': return { ...state, isAvailable: action.payload };
    case 'RESET': return action.payload;
    default: return state;
  }
}

export function EditSpotModal({ isOpen, onClose, onSubmit, spot, isLoading }: Props) {
  const [formData, dispatch] = useReducer(formReducer, {
    floor: 1,
    code: '',
    vehicleType: VEHICLE_TYPES.CAR,
    isAvailable: true,
  });

  // Update form when spot changes
  useEffect(() => {
    if (spot) {
      dispatch({
        type: 'RESET',
        payload: {
          floor: spot.floor,
          code: spot.code,
          vehicleType: spot.vehicleType,
          isAvailable: spot.isAvailable,
        },
      });
    }
  }, [spot]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (spot) {
      const normalized: UpdateSpotRequest = {
        ...formData,
        floor: formData.floor ?? 1, // fallback to 1 if cleared
      };
      onSubmit(spot.id, normalized);
    }
  }, [spot, formData, onSubmit]);

  if (!isOpen || !spot) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-spot-title"
    >
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 id="edit-spot-title" className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Edit Spot {spot.code}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Spot Code */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Spot Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => dispatch({ type: 'SET_CODE', payload: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., A1, B2, C3"
              required
            />
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Floor
            </label>
            <input
              type="number"
              value={formData.floor ?? ''} 
              onChange={(e) =>
                dispatch({
                  type: 'SET_FLOOR',
                  payload: e.target.value === '' ? undefined : parseInt(e.target.value, 10),
                })
              }
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              min="1"
              max="99"
              required
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Vehicle Type
            </label>
            <select
              value={formData.vehicleType}
              onChange={(e) => dispatch({ type: 'SET_VEHICLE', payload: e.target.value as VehicleType })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              required
            >
              {getVehicleTypeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Current Status */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Current Status:</span>
              <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${
                spot.isAvailable 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${spot.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{spot.isAvailable ? 'Available' : 'Occupied'}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.code?.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Spot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
