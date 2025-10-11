import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetParkingLotByIdQuery, useGetSpotsByParkingLotIdQuery } from '@parking/api/parkingApi';
import { WalkInStayList, WalkInStayFilters, CreateWalkInStayForm, ExtendTimeModal } from '../components';
import { WalkInStayStatus } from '../types';
import { useAppDispatch, useAppSelector } from '@hooks';
import { 
  openCreateModal, 
  closeCreateModal, 
  openExtendModal, 
  closeExtendModal,
  setSelectedWalkInStay 
} from '../slice/walkInStaysSlice';

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
            Retry
          </button>
        </div>
      </div>
    </div>
  </div>
);

export function WalkInStaysPage() {
  const { lotId } = useParams<{ lotId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const parkingLotId = lotId ? parseInt(lotId, 10) : null;

  // State for filters
  const [filters, setFilters] = useState<{
    status?: WalkInStayStatus;
    vehiclePlate?: string;
    showActiveOnly?: boolean;
  }>({});

  // Redux state for modals
  const { isCreateModalOpen, isExtendModalOpen, selectedWalkInStay } = useAppSelector(
    (state) => state.walkInStays
  );

  const {
    data: parkingLot,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetParkingLotByIdQuery(parkingLotId ?? 0, {
    skip: !parkingLotId,
  });

  // Fetch available spots for walk-in stay creation
  const {
    data: spotsData,
    isLoading: isSpotsLoading,
    isError: isSpotsError,
    refetch: refetchSpots,
  } = useGetSpotsByParkingLotIdQuery({
    parkingLotId: parkingLotId!,
    available: true, // filter for available spots
    page: 0,
    size: 1000, // fetch all available spots
  }, { 
    skip: !parkingLotId,
  });

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleCreateSuccess = () => {
    dispatch(closeCreateModal());
    // The list will automatically refresh due to RTK Query cache invalidation
  };

  const handleExtendSuccess = () => {
    dispatch(closeExtendModal());
    dispatch(setSelectedWalkInStay(null));
    // The list will automatically refresh due to RTK Query cache invalidation
  };

  // Get available spots from API query
  const availableSpots = spotsData?.data?.content || [];

  if (isLoading || isSpotsLoading) return <LoadingState />;

  if (isError) return (
    <div className="p-6">
      <ErrorState error={error} onRetry={refetch} />
    </div>
  );

  if (isSpotsError) return (
    <div className="p-6">
      <ErrorState error={isSpotsError} onRetry={refetchSpots} />
    </div>
  );

  if (!parkingLot) return (
    <div className="p-6">
      <div className="rounded-md bg-yellow-50 p-4">
        <h3 className="text-sm font-medium text-yellow-800">
          Parking lot not selected
        </h3>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="rounded-md bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100"
          >
            Go back
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
            Walk-In Stays
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage walk-in customers at {parkingLot.name}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => dispatch(openCreateModal())}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Walk-In Stay
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <WalkInStayFilters
          onFiltersChange={setFilters}
          initialFilters={filters}
        />
        <WalkInStayList
          parkingLotId={parkingLotId!}
          filters={filters}
        />
      </div>

      {/* Create Walk-In Stay Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <CreateWalkInStayForm
            parkingLotId={parkingLotId!}
            availableSpots={availableSpots}
            onSuccess={handleCreateSuccess}
            onCancel={() => dispatch(closeCreateModal())}
          />
        </div>
      )}

      {/* Extend Time Modal */}
      {isExtendModalOpen && selectedWalkInStay && (
        <ExtendTimeModal
          isOpen={isExtendModalOpen}
          onClose={() => {
            dispatch(closeExtendModal());
            dispatch(setSelectedWalkInStay(null));
          }}
          walkInStay={selectedWalkInStay}
          onSuccess={handleExtendSuccess}
        />
      )}
    </div>
  );
}

export default WalkInStaysPage;
