import { useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGetParkingLotsByUserIdQuery } from '@parking/api/parkingApi';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { 
  toggleSidebar,
  selectIsSidebarOpen
} from '@slices/appSlice';
import {
  setSelectedParkingLotId,
  setParkingLots,
  setParkingLotsLoading,
  setParkingLotsError,
  clearParkingLotsError
} from '@parking/slice/parkingSlice';
import {
  selectSelectedParkingLotId,
  selectParkingLots,
  selectParkingLotsLoading,
  selectParkingLotsError
} from '@parking/selectors/parkingLotSelectors';
import type { ParkingLotResponse } from '@parking/types';
import { selectAuth } from '@auth/selectors';
import { NotificationProvider, useNotification } from '@shared/contexts/NotificationContext';
import { FullPageSpinner, ErrorScreen } from '@shared/pages';

// Layout components
import { AppSidebar } from './AppSidebar';
import { GlobalNotifications } from './GlobalNotifications';

function AppContent() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const auth = useAppSelector(selectAuth);
  const selectedLotId = useAppSelector(selectSelectedParkingLotId);
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen);
  const managerLots = useAppSelector(selectParkingLots);
  const isLoading = useAppSelector(selectParkingLotsLoading);
  const isError = useAppSelector(selectParkingLotsError);

  const dispatch = useAppDispatch();
  const { notification } = useNotification();

  const { 
    data: managerLotsData, 
    isLoading: apiLoading,
    isError: apiError,
    error: apiErrorMessage,
    refetch 
  } = useGetParkingLotsByUserIdQuery(auth.user?.id ?? 0, {
    skip: !auth.user?.id,
  });

  // Memoized comparison for efficient change detection
  const lotsChanged = useMemo(() => {
    if (!managerLotsData?.data || !Array.isArray(managerLotsData.data)) return false;
    if (managerLots.length !== managerLotsData.data.length) return true;

    // Shallow comparison by IDs and key properties
    return managerLots.some((currentLot: ParkingLotResponse, index: number) => {
      const newLot = managerLotsData.data[index];
      return !newLot ||
             currentLot.id !== newLot.id ||
             currentLot.name !== newLot.name ||
             currentLot.address !== newLot.address ||
             currentLot.updatedAt !== newLot.updatedAt;
    });
  }, [managerLots, managerLotsData?.data]);

  useEffect(() => {
    if (apiLoading) {
      dispatch(setParkingLotsLoading(true));
      return;
    }

    if (apiError) {
      let errorMessage = 'Failed to fetch parking lots';
      if (typeof apiErrorMessage === 'string') {
        errorMessage = apiErrorMessage;
      } else if (apiErrorMessage && 'message' in apiErrorMessage && apiErrorMessage.message) {
        errorMessage = apiErrorMessage.message;
      }
      dispatch(setParkingLotsError(errorMessage));
      return;
    }

    if (managerLotsData?.data) {
      if (lotsChanged) {
        dispatch(setParkingLots(managerLotsData.data));
      }
      dispatch(setParkingLotsLoading(false));
    }
  }, [apiLoading, apiError, apiErrorMessage, managerLotsData, lotsChanged, dispatch]);

  // Handle lot selection and URL sync
  useEffect(() => {
    if (!auth.user?.id || isLoading) return;

    if (!managerLots.length) {
      if (location.pathname !== '/app/welcome') {
        navigate('/app/welcome', { replace: true });
      }
      return;
    }

    const urlLotId = params.lotId ? Number(params.lotId) : null;
    const isValidUrlLot = urlLotId && managerLots.some((lot: ParkingLotResponse) => lot.id === urlLotId);
    const isValidSelectedLot = selectedLotId && managerLots.some((lot: ParkingLotResponse) => lot.id === selectedLotId);

    const targetLotId = isValidUrlLot
      ? urlLotId
      : isValidSelectedLot
      ? selectedLotId
      : managerLots[0]?.id;

    if (targetLotId && targetLotId !== selectedLotId) {
      dispatch(setSelectedParkingLotId(targetLotId));
    }

    const needsLotContext =
      ['/app/dashboard', '/app/dashboard/select-lot'].includes(location.pathname) ||
      /^\/app\/\d+$/.test(location.pathname);

    if (needsLotContext && String(targetLotId) !== params.lotId) {
      navigate(`/app/dashboard/${targetLotId}`, { replace: true });
    }
  }, [auth.user?.id, params.lotId, managerLots, selectedLotId, isLoading, location.pathname, navigate, dispatch]);

  const handleRefetch = () => {
    dispatch(clearParkingLotsError());
    refetch();
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return (
      <ErrorScreen
        message="Could not load parking lots."
        onRetry={handleRefetch}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700">
      <AppSidebar
        sidebarCollapsed={!isSidebarOpen}
        onToggleSidebar={() => dispatch(toggleSidebar())}
        user={auth.user}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <GlobalNotifications notification={notification} />
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function AppLayout() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}
