import { useState } from 'react';
import { formatDateTime, RESERVATION_STATUS } from '../../constants/reservations';
import { ReservationResponse, ReservationStatus } from '../../types';
import { useUpdateReservationStatusMutation } from '../../api/reservationApi';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';
import { useNotification } from '@shared/contexts/NotificationContext';
import { AppErrorHandler } from '@shared/utils/errorHandling';
import { Modal } from '@shared/ui/components';

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
    const { t } = useTypedTranslation();
    const { showNotification } = useNotification();
    
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(reservation?.status ?? '');
    const [currentReservation, setCurrentReservation] = useState(reservation);

    const [updateStatus, { isLoading }] = useUpdateReservationStatusMutation();

    if (!isOpen || !currentReservation) return null;

    const statusKeys = Object.keys(RESERVATION_STATUS) as Array<ReservationStatus>;

    const statusConfig = RESERVATION_STATUS[currentReservation.status] ?? {
        labelKey: currentReservation.status,
        color: 'bg-gray-100 text-gray-800',
    };

    const handleSaveStatus = async () => {
        try {
            await updateStatus({
                id: currentReservation.id,
                status: selectedStatus,
            }).unwrap();

            setCurrentReservation((prev) =>
                prev ? { ...prev, status: selectedStatus as ReservationStatus } : prev
            );

            setIsEditingStatus(false);
            showNotification('success', t('reservations.modals.detail.statusUpdatedSuccessfully'));
        } catch (error) {
            const appError = AppErrorHandler.transformApiError(error, 'updateReservationStatus');
            AppErrorHandler.handleError(appError, { 
                reservationId: currentReservation.id, 
                newStatus: selectedStatus 
            });
            
            const userMessage = AppErrorHandler.getUserFriendlyMessage(appError);
            showNotification('error', userMessage);
        }
    };

    const durationDays = Math.ceil(
        (new Date(currentReservation.expectedEndTime).getTime() -
            new Date(currentReservation.reservedStartTime).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white rounded-lg shadow-xl w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{t('reservations.modals.detail.title')}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        aria-label={t('common.close')}
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
                            <h3 className="text-lg font-medium text-gray-900">{t('reservations.modals.detail.reservation')}</h3>
                            <p className="text-sm text-gray-500">
                                {formatDateTime(currentReservation.reservedStartTime, true)}
                            </p>
                        </div>

                        <div>
                            {!isEditingStatus ? (
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
                                >
                                    {statusConfig.labelKey ? t(statusConfig.labelKey) : currentReservation.status}
                                </span>
                            ) : (
                                <select
                                    className="text-sm border border-gray-300 rounded-md p-1.5 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {statusKeys.map((key) => (
                                        <option key={key} value={key}>
                                            {RESERVATION_STATUS[key].labelKey ? t(RESERVATION_STATUS[key].labelKey) : key}
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
                            <h4 className="text-sm font-medium text-gray-700 mb-3">{t('reservations.modals.detail.vehicle')}</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">{t('reservations.modals.detail.licensePlate')}:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {currentReservation.vehicleLicensePlate}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">{t('reservations.modals.detail.brand')}:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {currentReservation.vehicleInfo}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">{t('reservations.modals.detail.type')}:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {currentReservation.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">{t('reservations.modals.detail.user')}</h4>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">{t('reservations.modals.detail.name')}:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {currentReservation.userName} {currentReservation.userLastName}
                                </span>
                            </div>
                        </div>

                        {/* Spot Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">{t('reservations.modals.detail.parkedIn')}</h4>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">{t('reservations.modals.detail.name')}:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {currentReservation.spotName}
                                </span>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">{t('reservations.modals.detail.schedule')}</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">{t('reservations.modals.detail.duration')}:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {durationDays} {durationDays > 1 ? t('reservations.modals.detail.days') : t('reservations.modals.detail.day')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">{t('reservations.modals.detail.payment')}</h4>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{t('reservations.modals.detail.estimatedTotal')}:</span>
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
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={handleSaveStatus}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        {isLoading ? t('reservations.modals.detail.saving') : t('common.save')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        onClick={onClose}
                                    >
                                        {t('common.close')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingStatus(true)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        {t('reservations.modals.detail.updateStatus')}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ReservationDetailModal;
