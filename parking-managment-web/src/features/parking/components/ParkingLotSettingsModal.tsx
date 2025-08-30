import { useState, useEffect } from 'react';
import type { UpdateParkingLotRequest, ParkingLotResponse } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lotData: UpdateParkingLotRequest) => void;
  parkingLot: ParkingLotResponse | null | undefined;
  isLoading: boolean;
}

export function ParkingLotSettingsModal({ isOpen, onClose, onSubmit, parkingLot, isLoading }: Props) {
  const [formData, setFormData] = useState<UpdateParkingLotRequest>({
    name: '',
    address: '',
    imageUrl: '',
  });

  // Update form data when parkingLot changes
  useEffect(() => {
    if (parkingLot) {
      setFormData({
        name: parkingLot.name || '',
        address: parkingLot.address || '',
        imageUrl: parkingLot.imageUrl || '',
      });
    }
  }, [parkingLot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Parking Lot Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Central Parking Garage"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Address *
            </label>
            <textarea
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="e.g., 123 Main Street, Downtown, City 12345"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Image URL <span className="text-neutral-500">(Optional)</span>
            </label>
            <input
              type="url"
              value={formData.imageUrl || ''}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/parking-lot-image.jpg"
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Provide a URL to an image that represents this parking lot
            </p>
          </div>

          {/* Parking Lot Info */}
          {parkingLot && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Parking Lot Info</h4>
              <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-mono">#{parkingLot.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Manager ID:</span>
                  <span className="font-mono">#{parkingLot.managerId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(parkingLot.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
          
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
              disabled={isLoading || !formData.name?.trim() || !formData.address?.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
