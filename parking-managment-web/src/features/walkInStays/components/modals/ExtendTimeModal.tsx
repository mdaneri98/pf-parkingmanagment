import { useState } from 'react';
import { useExtendWalkInStayTimeMutation } from '../../api/walkInStaysApi';
import { WalkInStayResponse } from '../../types';
import { formatDateTime } from '../../constants/walkInStays';

interface ExtendTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  walkInStay: WalkInStayResponse | null;
  onSuccess?: () => void;
}

export const ExtendTimeModal = ({
  isOpen,
  onClose,
  walkInStay,
  onSuccess,
}: ExtendTimeModalProps) => {
  const [extraHours, setExtraHours] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [extendTime, { isLoading }] = useExtendWalkInStayTimeMutation();

  if (!isOpen || !walkInStay) return null;

  const currentEndTime = new Date(walkInStay.expectedEndTime);
  const newEndTime = new Date(currentEndTime.getTime() + extraHours * 60 * 60 * 1000);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (extraHours <= 0) {
      newErrors.extraHours = 'Extra hours must be greater than 0';
    } else if (extraHours > 12) {
      newErrors.extraHours = 'Cannot extend more than 12 hours at once';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await extendTime({
        id: walkInStay.id,
        extraHours,
      }).unwrap();
      
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error extending time:', error);
      
      if (error?.data?.message) {
        setErrors({ general: error.data.message });
      } else {
        setErrors({ general: 'Failed to extend stay time' });
      }
    }
  };

  const handleInputChange = (value: number) => {
    setExtraHours(value);
    
    // Clear error when user changes value
    if (errors.extraHours) {
      setErrors(prev => ({ ...prev, extraHours: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Extend Stay Time</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
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

        <form onSubmit={handleSubmit} className="p-6">
          {/* General Error */}
          {errors.general && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{errors.general}</div>
            </div>
          )}

          {/* Vehicle Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Vehicle</h4>
            <p className="text-sm text-gray-900">{walkInStay.vehicleLicensePlate}</p>
            <p className="text-xs text-gray-500">Spot: {walkInStay.spotName}</p>
          </div>

          {/* Current End Time */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-700 mb-2">Current End Time</h4>
            <p className="text-sm text-blue-900">{formatDateTime(walkInStay.expectedEndTime)}</p>
          </div>

          {/* Extra Hours Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extra Hours *
            </label>
            <input
              type="number"
              min="0.5"
              max="12"
              step="0.5"
              value={extraHours}
              onChange={(e) => handleInputChange(parseFloat(e.target.value))}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.extraHours ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.extraHours && (
              <p className="mt-1 text-sm text-red-600">{errors.extraHours}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Between 0.5 and 12 hours
            </p>
          </div>

          {/* New End Time Preview */}
          <div className="mb-6 p-3 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium text-green-700 mb-2">New End Time</h4>
            <p className="text-sm text-green-900">{formatDateTime(newEndTime.toISOString())}</p>
            <p className="text-xs text-green-600">
              {extraHours} hour{extraHours !== 1 ? 's' : ''} extension
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Extending...' : 'Extend Time'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
