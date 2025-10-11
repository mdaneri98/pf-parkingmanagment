import { useState } from 'react';
import { useCreateWalkInStayMutation } from '../../api/walkInStaysApi';
import { CreateWalkInStayRequest } from '../../types';
import { WALK_IN_STAY_CONSTANTS, WALK_IN_STAY_ERROR_MESSAGES } from '../../constants/walkInStays';
import { Input } from '@shared/ui/components';

interface CreateWalkInStayFormProps {
  parkingLotId: number;
  availableSpots: Array<{ id: number; code: string; floor: number; vehicleType: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateWalkInStayForm({
  parkingLotId,
  availableSpots,
  onSuccess,
  onCancel,
}: CreateWalkInStayFormProps) {
  const [formData, setFormData] = useState<CreateWalkInStayRequest>({
    spotId: 0,
    vehicleLicensePlate: '',
    expectedDurationHours: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createWalkInStay, { isLoading }] = useCreateWalkInStayMutation();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.spotId) {
      newErrors.spotId = WALK_IN_STAY_ERROR_MESSAGES.VALIDATION.SPOT_REQUIRED;
    }

    if (!formData.vehicleLicensePlate.trim()) {
      newErrors.vehicleLicensePlate = WALK_IN_STAY_ERROR_MESSAGES.VALIDATION.LICENSE_PLATE_REQUIRED;
    } else if (formData.vehicleLicensePlate.length > WALK_IN_STAY_CONSTANTS.VALIDATION.MAX_LICENSE_PLATE_LENGTH) {
      newErrors.vehicleLicensePlate = WALK_IN_STAY_ERROR_MESSAGES.VALIDATION.LICENSE_PLATE_MAX;
    }

    if (formData.expectedDurationHours < WALK_IN_STAY_CONSTANTS.VALIDATION.MIN_DURATION_HOURS) {
      newErrors.expectedDurationHours = WALK_IN_STAY_ERROR_MESSAGES.VALIDATION.DURATION_MIN;
    } else if (formData.expectedDurationHours > WALK_IN_STAY_CONSTANTS.VALIDATION.MAX_DURATION_HOURS) {
      newErrors.expectedDurationHours = WALK_IN_STAY_ERROR_MESSAGES.VALIDATION.DURATION_MAX;
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
      await createWalkInStay(formData).unwrap();
      onSuccess();
    } catch (error: any) {
      console.error('Error creating walk-in stay:', error);
      
      // Handle API validation errors
      if (error?.data?.message) {
        setErrors({ general: error.data.message });
      } else {
        setErrors({ general: WALK_IN_STAY_ERROR_MESSAGES.WALK_IN_STAY.CREATE_FAILED });
      }
    }
  };

  const handleInputChange = (field: keyof CreateWalkInStayRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Create Walk-In Stay</h2>
        <button
          onClick={onCancel}
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

        {/* Spot Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parking Spot *
          </label>
          <select
            value={formData.spotId}
            onChange={(e) => handleInputChange('spotId', parseInt(e.target.value))}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.spotId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value={0}>Select a spot</option>
            {availableSpots.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.code} - Floor {spot.floor} ({spot.vehicleType})
              </option>
            ))}
          </select>
          {errors.spotId && (
            <p className="mt-1 text-sm text-red-600">{errors.spotId}</p>
          )}
        </div>

        {/* Vehicle License Plate */}
        <div className="mb-4">
          <Input
            label="Vehicle License Plate *"
            type="text"
            value={formData.vehicleLicensePlate}
            onChange={(e) => handleInputChange('vehicleLicensePlate', e.target.value.toUpperCase())}
            error={errors.vehicleLicensePlate}
            disabled={isLoading}
            placeholder="Enter license plate..."
            helpText={`Maximum ${WALK_IN_STAY_CONSTANTS.VALIDATION.MAX_LICENSE_PLATE_LENGTH} characters`}
          />
        </div>

        {/* Expected Duration */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Duration (hours) *
          </label>
          <input
            type="number"
            min={WALK_IN_STAY_CONSTANTS.VALIDATION.MIN_DURATION_HOURS}
            max={WALK_IN_STAY_CONSTANTS.VALIDATION.MAX_DURATION_HOURS}
            step="0.5"
            value={formData.expectedDurationHours}
            onChange={(e) => handleInputChange('expectedDurationHours', parseFloat(e.target.value))}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.expectedDurationHours ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.expectedDurationHours && (
            <p className="mt-1 text-sm text-red-600">{errors.expectedDurationHours}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Between {WALK_IN_STAY_CONSTANTS.VALIDATION.MIN_DURATION_HOURS} and {WALK_IN_STAY_CONSTANTS.VALIDATION.MAX_DURATION_HOURS} hours
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Stay'}
          </button>
        </div>
      </form>
    </div>
  );
}
