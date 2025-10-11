import { useState, useEffect } from 'react';
import { 
  useUpdateWalkInStayStatusMutation,
  useGetRemainingTimeQuery 
} from '../../api/walkInStaysApi';
import { WalkInStayResponse, WalkInStayStatus } from '../../types';
import { 
  formatDateTime, 
  formatCurrency, 
  calculateDuration,
  WALK_IN_STAY_STATUS,
  formatRemainingTime,
  WALK_IN_STAY_CONSTANTS,
} from '../../constants/walkInStays';

interface WalkInStayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  walkInStay: WalkInStayResponse | null;
  onOpenExtendModal?: () => void;
}

export const WalkInStayDetailModal = ({
  isOpen,
  onClose,
  walkInStay,
  onOpenExtendModal,
}: WalkInStayDetailModalProps) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<WalkInStayStatus>(walkInStay?.status ?? WalkInStayStatus.PENDING);
  const [currentWalkInStay, setCurrentWalkInStay] = useState(walkInStay);

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateWalkInStayStatusMutation();

  // Poll remaining time for active stays
  const shouldPoll = currentWalkInStay?.status === WalkInStayStatus.ACTIVE;
  const {
    data: remainingTimeData,
    isLoading: isRemainingTimeLoading,
    refetch: refetchRemainingTime,
  } = useGetRemainingTimeQuery(currentWalkInStay?.id ?? 0, {
    skip: !shouldPoll || !currentWalkInStay?.id,
    pollingInterval: WALK_IN_STAY_CONSTANTS.POLLING.REMAINING_TIME_INTERVAL,
  });

  useEffect(() => {
    setCurrentWalkInStay(walkInStay);
    setSelectedStatus(walkInStay?.status ?? WalkInStayStatus.PENDING);
  }, [walkInStay]);

  if (!isOpen || !currentWalkInStay) return null;

  const statusKeys = Object.keys(WALK_IN_STAY_STATUS) as Array<keyof typeof WALK_IN_STAY_STATUS>;

  const statusConfig = WALK_IN_STAY_STATUS[currentWalkInStay.status] ?? {
    label: currentWalkInStay.status,
    color: 'bg-gray-100 text-gray-800',
  };

  const handleSaveStatus = async () => {
    try {
      await updateStatus({
        id: currentWalkInStay.id,
        status: selectedStatus,
      }).unwrap();

      setCurrentWalkInStay((prev) =>
        prev ? { ...prev, status: selectedStatus } : prev
      );

      setIsEditingStatus(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating walk-in stay status');
    }
  };

  const durationHours = calculateDuration(currentWalkInStay.startTime, currentWalkInStay.expectedEndTime);
  const remainingTime = remainingTimeData?.data;
  const isOvertime = remainingTime?.isOvertime || false;
  const remainingMinutes = remainingTime?.remainingMinutes || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Walk-In Stay Details</h2>
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

        <div className="p-6">
          {/* Status */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Walk-In Stay</h3>
              <p className="text-sm text-gray-500">
                {formatDateTime(currentWalkInStay.startTime, true)}
              </p>
            </div>

            <div>
              {!isEditingStatus ? (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
                >
                  {statusConfig.label}
                </span>
              ) : (
                <select
                  className="text-sm border border-gray-300 rounded-md p-1.5 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as WalkInStayStatus)}
                >
                  {statusKeys.map((key) => (
                    <option key={key} value={key}>
                      {WALK_IN_STAY_STATUS[key].label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Remaining Time Display (for active stays) */}
          {shouldPoll && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-blue-900">Remaining Time</h4>
                <button
                  onClick={() => refetchRemainingTime()}
                  className="text-xs text-blue-600 hover:text-blue-800"
                  disabled={isRemainingTimeLoading}
                >
                  {isRemainingTimeLoading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              <div className="mt-2">
                {isRemainingTimeLoading ? (
                  <span className="text-blue-700">Loading...</span>
                ) : (
                  <span className={`text-lg font-semibold ${isOvertime ? 'text-red-600' : 'text-blue-700'}`}>
                    {formatRemainingTime(remainingMinutes)}
                  </span>
                )}
                {isOvertime && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Overdue</p>
                )}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {/* Vehicle Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Vehicle</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">License Plate:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {currentWalkInStay.vehicleLicensePlate}
                  </span>
                </div>
                {currentWalkInStay.vehicleInfo && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Info:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {currentWalkInStay.vehicleInfo}
                    </span>
                  </div>
                )}
                {currentWalkInStay.type && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {currentWalkInStay.type}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* User Info (if available) */}
            {currentWalkInStay.userName && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">User</h4>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {currentWalkInStay.userName} {currentWalkInStay.userLastName}
                  </span>
                </div>
              </div>
            )}

            {/* Spot Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Parking Spot</h4>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Spot:</span>
                <span className="text-sm font-medium text-gray-900">
                  {currentWalkInStay.spotName}
                </span>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Schedule</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Start Time:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDateTime(currentWalkInStay.startTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Expected End:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDateTime(currentWalkInStay.expectedEndTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {durationHours}h
                  </span>
                </div>
                {currentWalkInStay.actualEndTime && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Actual End:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDateTime(currentWalkInStay.actualEndTime)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Payment</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Price:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(currentWalkInStay.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              {isEditingStatus ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditingStatus(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={handleSaveStatus}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {isUpdatingStatus ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingStatus(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Update Status
                  </button>
                  {currentWalkInStay.status === WalkInStayStatus.ACTIVE && onOpenExtendModal && (
                    <button
                      type="button"
                      onClick={onOpenExtendModal}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      Extend Time
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
