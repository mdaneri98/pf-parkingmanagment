import { useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useGetParkingLotsQuery } from '../features/parking/api/parkingApi';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setSelectedParkingLotId } from '../features/parking/slice/parkingSlice';
import { selectAuth } from '../features/auth/selectors';
import { ParkingLotSelector } from '../features/parking/components/ParkingLotSelector';

export function DashboardLayout() {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useGetParkingLotsQuery();

  const allLots = data?.data ?? [];
  const managedLots = useMemo(
    () => allLots.filter((lot) => (user ? lot.managerId === user.id : false)),
    [allLots, user]
  );

  // Sync selection and URL
  useEffect(() => {
    const urlLotId = params.lotId ? Number(params.lotId) : null;
    if (urlLotId) {
      dispatch(setSelectedParkingLotId(urlLotId));
      localStorage.setItem('selectedParkingLotId', String(urlLotId));
      return;
    }

    // Resolve from storage or first managed
    const stored = localStorage.getItem('selectedParkingLotId');
    const storedId = stored ? Number(stored) : null;
    const fallbackId = managedLots[0]?.id ?? null;
    const nextId = storedId ?? fallbackId;
    if (nextId) {
      dispatch(setSelectedParkingLotId(nextId));
      navigate(`/app/${nextId}`, { replace: true });
    }
  }, [params.lotId, managedLots, dispatch, navigate]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-b md:border-b-0 md:border-r p-4">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your parking lots</p>
        </div>
        <ParkingLotSelector lots={managedLots} isLoading={isLoading} isError={isError} />
      </aside>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}


