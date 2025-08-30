import { useState, useEffect } from 'react';
import type { SpotDTO, UpdateSpotRequest } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, spotData: UpdateSpotRequest) => void;
  spot: SpotDTO | null;
  isLoading: boolean;
}

export function EditSpotModal({ isOpen, onClose, onSubmit, spot, isLoading }: Props) {
  const [formData, setFormData] = useState<UpdateSpotRequest>({
    floor: 1,
    code: '',
    vehicleType: 'car',
  });

  // Update form data when spot changes
  useEffect(() => {
    if (spot) {
      setFormData({
        floor: spot.floor,
        code: spot.code,
        vehicleType: spot.vehicleType,
      });
    }
  }, [spot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (spot) {
      onSubmit(spot.id, formData);
    }
  };

  if (!isOpen || !spot) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Edit Spot {spot.code}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
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
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., A1, B2, C3"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Floor
            </label>
            <input
              type="number"
              value={formData.floor || 1}
              onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="99"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Vehicle Type
            </label>
            <select
              value={formData.vehicleType || 'car'}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="car">🚗 Car</option>
              <option value="motorcycle">🏍️ Motorcycle</option>
              <option value="truck">🚛 Truck</option>
              <option value="van">🚐 Van</option>
              <option value="electric">⚡ Electric Vehicle</option>
            </select>
          </div>

          {/* Current Status Display */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Current Status:</span>
              <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${
                spot.isAvailable 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${spot.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{spot.isAvailable ? 'Available' : 'Occupied'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.code?.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Spot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
