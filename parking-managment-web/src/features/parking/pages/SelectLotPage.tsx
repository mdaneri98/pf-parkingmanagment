import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/useAppSelector';
import { 
  selectParkingLots,
  selectParkingLotsLoading,
  selectParkingLotsError
} from '@parking/selectors/parkingLotSelectors';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { clearParkingLotsError } from '@parking/slice/parkingSlice';
import { parkingApi } from '@parking/api/parkingApi';
import { ImagePreview } from '@shared/components/ImagePreview';
import type { ParkingLotResponse } from '@parking/types';

export function SelectLotPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const parkingLots = useAppSelector(selectParkingLots);
  const isLoading = useAppSelector(selectParkingLotsLoading);
  const isError = useAppSelector(selectParkingLotsError);

  const handleRefetch = () => {
    dispatch(clearParkingLotsError());
    dispatch(parkingApi.util.invalidateTags(['UserParkingLots']));
  };

  const handleLotSelect = (lotId: number) => {
    navigate(`/app/dashboard/${lotId}`);
  };


  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading your parking lots...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Failed to Load Parking Lots
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            We couldn't load your parking lots. Please check your connection and try again.
          </p>
          <Button
            onClick={handleRefetch}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!parkingLots.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            No Parking Lots Yet
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
            You don't have any parking lots yet. Please contact your administrator to get access to parking lots.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Select a Parking Lot
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Choose a parking lot to manage.
        </p>
      </div>

      {/* Parking Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {parkingLots.map((lot: ParkingLotResponse) => (
          <div
            key={lot.id}
            onClick={() => handleLotSelect(lot.id)}
            className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 cursor-pointer hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 group"
          >
            {/* Lot Image or Icon */}
            <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center">
              {lot.imageUrl ? (
                <ImagePreview
                  src={lot.imageUrl}
                  alt={`${lot.name} parking lot`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            </div>

            {/* Lot Details */}
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
              {lot.name}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
              {lot.address}
            </p>

            {/* Action Indicator */}
            <div className="flex items-center justify-end text-sm">
              <span className="text-primary-600 dark:text-primary-400 font-medium">
                Click to manage →
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
