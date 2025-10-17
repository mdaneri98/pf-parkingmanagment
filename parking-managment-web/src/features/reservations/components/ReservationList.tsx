import { useState, useMemo, useEffect } from 'react';
import { useGetReservationsByParkingLotIdQuery } from '../api/reservationApi';
import { ReservationResponse, ReservationStatus } from '../types';
import {
    RESERVATION_CONSTANTS,
    RESERVATION_STATUS,
    formatDateTime,
    getStatusColor,
} from '../constants/reservations';
import { ReservationDetailModal } from './modals/ReservationDetailModal';
import { useNotification } from '@shared/contexts/NotificationContext';
import { useErrorHandler } from '@shared/utils/errorHandling';

const { DEFAULT_PAGE_SIZE} = RESERVATION_CONSTANTS.PAGINATION;

export function ReservationList({ parkingLotId, filters }: { parkingLotId: number; filters: any }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);
    const [selectedReservation, setSelectedReservation] = useState<ReservationResponse | null>(null);
    const { showNotification } = useNotification();
    const { getUserFriendlyMessage } = useErrorHandler();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetReservationsByParkingLotIdQuery({
        parkingLotId,
        page: currentPage - 1,
        size: itemsPerPage,
        ...filters,
    });

    const reservations = data?.data?.content ?? [];
    const totalPages = Math.ceil(reservations.length / itemsPerPage);

    // Show error notification when reservations fail to load
    useEffect(() => {
        if (isError && error) {
            const errorMessage = getUserFriendlyMessage(error);
            showNotification('error', `Failed to load reservations: ${errorMessage}`);
        }
    }, [isError, error, showNotification, getUserFriendlyMessage]);

    if (isLoading) return <div className="p-4 text-gray-500">Loading reservations...</div>;
    if (isError)
        return (
            <div className="p-4 text-red-600">
                Error loading reservations. <button onClick={refetch}>Retry</button>
            </div>
        );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);

    const openReservationDetails = (reservation: ReservationResponse) => {
        setSelectedReservation({
            ...reservation,
            vehicleType: 'Car',
            spotFloor: 1,
            totalPrice: reservation.price || 0,
        });
    };

    const closeModal = () => {
        setSelectedReservation(null);
    };

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                                >
                                    Vehicle
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                                >
                                    Parked In
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                                >
                                    Start
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                                >
                                    End
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                                >
                                    More details
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {currentItems.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                                        {reservation.vehicleLicensePlate}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {reservation.spotName}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {formatDateTime(reservation.reservedStartTime)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {formatDateTime(reservation.expectedEndTime)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          reservation.status as keyof typeof RESERVATION_STATUS
                      )}`}
                  >
                    {RESERVATION_STATUS[reservation.status as keyof typeof RESERVATION_STATUS]
                        ?.label || reservation.status}
                  </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right">
                                        <button
                                            onClick={() => openReservationDetails(reservation)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                            <span className="font-medium">
                {Math.min(indexOfLastItem, reservations.length)}
              </span>{' '}
                            of <span className="font-medium">{reservations.length}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        currentPage === page
                                            ? 'bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Reservation Detail Modal */}
            {selectedReservation && (
                <ReservationDetailModal
                    isOpen={!!selectedReservation}
                    onClose={closeModal}
                    reservation={selectedReservation}
                />
            )}
        </div>
    );
};

export default ReservationList;