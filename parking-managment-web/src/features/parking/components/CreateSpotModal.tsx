import { useState } from 'react';
import type { CreateSpotRequest, VEHICLE_TYPES } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (spotData: CreateSpotRequest) => void;
  parkingLotId: number;
  isLoading: boolean;
}

export function CreateSpotModal({ isOpen, onClose, onSubmit, parkingLotId, isLoading }: Props) {
  const [formData, setFormData] = useState<CreateSpotRequest>({
    parkingLotId,
    floor: 1,
    code: '',
    vehicleType: 'auto',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      parkingLotId,
      floor: 1,
      code: '',
      vehicleType: 'auto',
    });
  };

  const handleClose = () => {
    onClose();
    // Reset form data when closing
    setFormData({
      parkingLotId,
      floor: 1,
      code: '',
      vehicleType: 'auto',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Create New Spot</h2>
          <button onClick={handleClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Spot Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., A1, B2, C3"
              maxLength={10}
              required
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Enter a unique code for this spot (max 10 characters)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Floor
            </label>
            <input
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="-10"
              max="99"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Vehicle Type
            </label>
            <select
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="auto">🚗 Car (Auto)</option>
              <option value="motocicleta">🏍️ Motorcycle (Motocicleta)</option>
              <option value="camion">🚛 Truck (Camión)</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.code.trim() || formData.code.length > 10}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Spot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
