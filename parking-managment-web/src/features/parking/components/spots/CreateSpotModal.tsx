import { useState, useCallback } from 'react';
import type { CreateSpotRequest } from '@parking/types';
import { VEHICLE_TYPES, getVehicleTypeOptions, VehicleType } from '@shared/constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (spots: CreateSpotRequest[]) => void; // now supports multiple spots
  parkingLotId: number;
  isLoading: boolean;
}

const getInitialFormData = (parkingLotId: number) => ({
  parkingLotId,
  floor: 1 as number | '',
  prefix: '',
  startNumber: '' as number | '',
  endNumber: '' as number | '',
  vehicleType: VEHICLE_TYPES.CAR,
});

export function CreateSpotModal({ isOpen, onClose, onSubmit, parkingLotId, isLoading }: Props) {
  const [formData, setFormData] = useState(() => getInitialFormData(parkingLotId));

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData(parkingLotId));
  }, [parkingLotId]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const { prefix, startNumber, endNumber, floor, ...rest } = formData;

      const spots: CreateSpotRequest[] = [];
      const start = Number(startNumber);
      const end = Number(endNumber);

      for (let i = start; i <= end; i++) {
        spots.push({
          ...rest,
          floor: floor === '' ? 1 : floor,
          code: `${prefix || ''}${i}`,
        });
      }

      onSubmit(spots);
      resetForm();
    },
    [formData, onSubmit, resetForm]
  );

  const handleClose = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose, resetForm]);

  const updateFormField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Create New Spots
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
          >
            <svg
              className="w-5 h-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Spot Code Range */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Spot Code Range
            </label>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                value={formData.prefix}
                onChange={(e) => updateFormField('prefix', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg 
                           bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Prefix"
                maxLength={5}
              />
              <input
                type="number"
                value={formData.startNumber}
                onChange={(e) =>
                  updateFormField(
                    'startNumber',
                    e.target.value === '' ? '' : parseInt(e.target.value, 10)
                  )
                }
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg 
                           bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Start"
                min={0}
              />
              <input
                type="number"
                value={formData.endNumber}
                onChange={(e) =>
                  updateFormField(
                    'endNumber',
                    e.target.value === '' ? '' : parseInt(e.target.value, 10)
                  )
                }
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg 
                           bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="End"
                min={0}
              />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Codes will be generated as: Prefix + number (e.g. A0, A1, …, A50)
            </p>
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Floor
            </label>
            <input
              type="number"
              value={formData.floor}
              onChange={(e) =>
                updateFormField(
                  'floor',
                  e.target.value === '' ? '' : parseInt(e.target.value, 10)
                )
              }
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg 
                         bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={-10}
              max={99}
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
              onChange={(e) => updateFormField('vehicleType', e.target.value as VehicleType)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg 
                         bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {getVehicleTypeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-neutral-700 dark:text-neutral-300 
                         bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 
                         rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                formData.startNumber === '' ||
                formData.endNumber === '' ||
                Number(formData.endNumber) < Number(formData.startNumber)
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Spots'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
