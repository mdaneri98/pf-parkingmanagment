import { useState } from 'react';
import { formatDateTime, RESERVATION_STATUS } from '../../constants/reservations';
import { ReservationResponse } from '../../types';
import { useUpdateReservationStatusMutation } from '../../api/reservationApi';

interface ReservationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: ReservationResponse | null;
}

export const ReservationDetailModal = ({
                                           isOpen,
                                           onClose,
                                           reservation,
                                       }: ReservationDetailModalProps) => {
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(reservation?.status ?? '');
    const [currentReservation, setCurrentReservation] = useState(reservation); // 🔹 Estado local actualizado

    const [updateStatus, { isLoading }] = useUpdateReservationStatusMutation();

    if (!isOpen || !currentReservation) return null;

    const statusKeys = Object.keys(RESERVATION_STATUS) as Array<keyof typeof RESERVATION_STATUS>;

    const statusConfig = RESERVATION_STATUS[currentReservation.status] ?? {
        label: currentReservation.status,
        color: 'bg-gray-100 text-gray-800',
    };

    const handleSaveStatus = async () => {
        try {
            await updateStatus({
                id: currentReservation.id,
                status: selectedStatus,
            }).unwrap();

            setCurrentReservation((prev) =>
                prev ? { ...prev, status: selectedStatus } : prev
            );

            setIsEditingStatus(false);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating reservation status');
        }
    };

    const durationDays = Math.ceil(
        (new Date(currentReservation.expectedEndTime).getTime() -
            new Date(currentReservation.reservedStartTime).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Reservation Details</h2>
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
                            <h3 className="text-lg font-medium text-gray-900">Reservation</h3>
                            <p className="text-sm text-gray-500">
                                {formatDateTime(currentReservation.reservedStartTime, {
                                    dateStyle: 'full',
                                })}
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
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {statusKeys.map((key) => (
                                        <option key={key} value={key}>
                                            {RESERVATION_STATUS[key].label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {/* Vehicle Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Vehicle</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">License Plate:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {currentReservation.vehicleLicensePlate}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Brand:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {currentReservation.vehicleInfo}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Type:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {currentReservation.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">User</h4>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Name:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {currentReservation.userName} {currentReservation.userLastName}
                                </span>
                            </div>
                        </div>

                        {/* Spot Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Parked in</h4>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Name:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {currentReservation.spotName}
                                </span>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Schedule</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Duration:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {durationDays} {durationDays > 1 ? 'days' : 'day'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Payment</h4>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Estimated Total:</span>
                                <span className="text-xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('es-AR', {
                                        style: 'currency',
                                        currency: 'ARS',
                                        minimumFractionDigits: 2,
                                    }).format(currentReservation.price ?? 0)}
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
                                        disabled={isLoading}
                                        onClick={handleSaveStatus}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        {isLoading ? 'Saving...' : 'Save'}
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationDetailModal;
