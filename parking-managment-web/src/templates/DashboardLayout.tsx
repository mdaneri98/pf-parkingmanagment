import { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useGetParkingLotsQuery } from '../features/parking/api/parkingApi';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setSelectedParkingLotId } from '../features/parking/slice/parkingSlice';
import { selectAuth } from '../features/auth/selectors';
import { clearSession } from '../features/auth/slice/authSlice';
import { ParkingLotSelector } from '../features/parking/components/ParkingLotSelector';
import { UserProfile } from '../shared/ui/components';
import { appStorage } from '../shared/utils/storage';

export function DashboardLayout() {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useGetParkingLotsQuery();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const allLots = data?.data ?? [];
  const managedLots = useMemo(
    () => allLots.filter((lot) => (user ? lot.managerId === user.id : false)),
    [allLots, user]
  );

  useEffect(() => {
    const urlLotId = params.lotId ? Number(params.lotId) : null;
    if (urlLotId) {
      dispatch(setSelectedParkingLotId(urlLotId));
      appStorage.setSelectedParkingLotId(urlLotId);
      return;
    }

    // Resolve from storage or first managed
    const storedId = appStorage.getSelectedParkingLotId();
    const fallbackId = managedLots[0]?.id ?? null;
    const nextId = storedId ?? fallbackId;
    if (nextId) {
      dispatch(setSelectedParkingLotId(nextId));
      navigate(`/app/${nextId}`, { replace: true });
    }
  }, [params.lotId, managedLots, dispatch, navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear the session state
      dispatch(clearSession());
      // Navigate to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-700 p-4 flex flex-col">
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage your parking lots</p>
          </div>
          <ParkingLotSelector lots={managedLots} isLoading={isLoading} isError={isError} />
        </div>
        
        <UserProfile 
          user={user} 
          onLogout={handleLogout} 
          isLoggingOut={isLoggingOut}
        />
      </aside>
      <main className="p-4 bg-neutral-50 dark:bg-neutral-900">
        <Outlet />
      </main>
    </div>
  );
}


