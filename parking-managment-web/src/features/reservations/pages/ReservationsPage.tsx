import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetParkingLotByIdQuery } from '@parking/api/parkingApi';
import { ReservationList } from '../components/ReservationList';
import { ReservationFilters } from '../components/ReservationFilters';
import { ReservationStatus } from '../types';

// Simple loading component
const LoadingState = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

// Error state component
const ErrorState = ({
                        error,
                        onRetry
                    }: {
    error: any,
    onRetry: () => void
}) => (
    <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
            <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                    Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                    <p>{error?.data?.message || 'An error occurred'}</p>
                </div>
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={onRetry}
                        className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export function ReservationsPage() {
    const { lotId } = useParams<{ lotId: string }>();
    const navigate = useNavigate();
    const parkingLotId = lotId ? parseInt(lotId, 10) : null;

    // State for filters
    const [filters, setFilters] = useState<{
        status?: ReservationStatus;
        from?: string;
        to?: string;
    }>({});

    const {
        data: parkingLot,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetParkingLotByIdQuery(parkingLotId ?? 0, {
        skip: !parkingLotId,
    });

    const handleGoBack = () => {
        navigate(-1); // Go back to previous page
    };

    if (isLoading) return <LoadingState />;

    if (isError) return (
        <div className="p-6">
            <ErrorState error={error} onRetry={refetch} />
        </div>
    );

    if (!parkingLot) return (
        <div className="p-6">
            <div className="rounded-md bg-yellow-50 p-4">
                <h3 className="text-sm font-medium text-yellow-800">
                    Estacionamiento no seleccionado
                </h3>
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="rounded-md bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100"
                    >
                        Volver atrás
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Reservations
                    </h1>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <ReservationFilters
                    onFiltersChange={setFilters}
                    initialFilters={filters}
                />
                <ReservationList
                    parkingLotId={parkingLotId!}
                    filters={filters}
                />

            </div>
        </div>
    );
}

export default ReservationsPage;