import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { 
  selectParkingLots,
  selectParkingLotsLoading,
  selectParkingLotsError
} from '@parking/selectors/parkingLotSelectors';
import type { ParkingLotResponse } from '@parking/types';
import { parkingApi } from '@parking/api/parkingApi';
import { clearParkingLotsError } from '@parking/slice/parkingSlice';

interface Props {
  collapsed?: boolean;
}

export function ParkingLotSelector({ collapsed = false }: Props) {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const activeId = params.lotId ? Number(params.lotId) : null;
  
  const parkingLots = useAppSelector(selectParkingLots);
  const isLoading = useAppSelector(selectParkingLotsLoading);
  const isError = useAppSelector(selectParkingLotsError);

  const handleRefetch = () => {
    dispatch(clearParkingLotsError());
    dispatch(parkingApi.util.invalidateTags(['UserParkingLots']));
  };

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <div className="h-14 skeleton" />
          <div className="h-14 skeleton" />
          <div className="h-14 skeleton" />
        </div>
      );
    }
    if (isError) {
      return (
        <div className={`p-4 alert-error rounded-xl ${
          collapsed ? 'text-center' : ''
        }`}>
          {!collapsed && (
            <div className="text-error-700 dark:text-error-300 text-sm font-semibold mb-3">
              Failed to load parking lots
            </div>
          )}
          <button
            onClick={handleRefetch}
            className={`${
              collapsed 
                ? 'p-3 w-full' 
                : 'px-4 py-2'
            } text-sm bg-error-600 hover:bg-error-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md`}
            title={collapsed ? 'Retry loading parking lots' : undefined}
          >
            {collapsed ? '⟳' : 'Retry'}
          </button>
        </div>
      );
    }
    if (!parkingLots.length) {
      return (
        <div className={`p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 ${
          collapsed ? 'text-center' : ''
        }`}>
          {collapsed ? (
            <button
              onClick={() => navigate('/app/welcome')}
              className="w-full p-3 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              title="Create your first parking lot"
            >
              +
            </button>
          ) : (
            <div className="text-center">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-3">
                No parking lots yet.
              </p>
            </div>
          )}
        </div>
      );
    }
    return (
      <ul className="space-y-2">
        {parkingLots.map((parkingLot: ParkingLotResponse) => (
          <li key={parkingLot.id}>
            <button
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                activeId === parkingLot.id 
                  ? 'bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20 text-primary-900 dark:text-primary-100 font-semibold border border-primary-200/50 dark:border-primary-700/50 shadow-sm' 
                  : 'hover:bg-neutral-100/80 dark:hover:bg-neutral-700/80 text-neutral-900 dark:text-neutral-100 hover:shadow-sm'
              } ${collapsed ? 'text-center' : ''}`}
              onClick={() => navigate(`/app/dashboard/${parkingLot.id}`)}
              title={collapsed ? `${parkingLot.name} - ${parkingLot.address}` : undefined}
            >
              {collapsed ? (
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {parkingLot.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <>
                  <div className="text-sm font-medium">{parkingLot.name}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-1">{parkingLot.address}</div>
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
    );
  }, [isLoading, isError, parkingLots, activeId, navigate, collapsed, handleRefetch]);

  return (
    <div>
      {!collapsed && (
        <div className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-gradient-to-r from-neutral-700 to-neutral-500 dark:from-neutral-300 dark:to-neutral-100 bg-clip-text">
          Your Parking Lots
        </div>
      )}
      {content}
    </div>
  );
}


