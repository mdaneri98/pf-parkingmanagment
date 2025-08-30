import { useEffect, useState, useMemo } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useGetParkingLotsByUserIdQuery } from '../features/parking/api/parkingApi';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setSelectedParkingLotId, selectSelectedParkingLotId, selectSidebarCollapsed, toggleSidebar } from '../features/parking/slice/parkingSlice';
import { selectAuth } from '../features/auth/selectors';
import { clearSession } from '../features/auth/slice/authSlice';
import { ParkingLotSelector } from '../features/parking/components/ParkingLotSelector';
import { UserProfile } from '../shared/ui/components';
import { NotificationProvider, useNotification } from '@shared/contexts/NotificationContext';

function DashboardContent() {
  const navigate = useNavigate();
  const params = useParams();
  const auth = useAppSelector(selectAuth);
  const selectedLotId = useAppSelector(selectSelectedParkingLotId);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { notification } = useNotification();

  const { data: userLotsData, isLoading, isError, refetch } = useGetParkingLotsByUserIdQuery(
    auth.user?.id || 0,
    { skip: !auth.user?.id }
  );

  const userLots = useMemo(() => userLotsData?.data || [], [userLotsData?.data]);

  useEffect(() => {
    if (!auth.user?.id || isLoading || !userLots.length) return;
    
    const urlLotId = params.lotId ? Number(params.lotId) : null;
    
    if (urlLotId && userLots.some(lot => lot.id === urlLotId)) {
      if (selectedLotId !== urlLotId) {
        dispatch(setSelectedParkingLotId(urlLotId));
      }
    } else {
      const targetId = selectedLotId && userLots.some(lot => lot.id === selectedLotId) 
        ? selectedLotId 
        : userLots[0].id;
      
      dispatch(setSelectedParkingLotId(targetId));
      navigate(`/app/${targetId}`, { replace: true });
    }
  }, [auth.user?.id, params.lotId, userLots, selectedLotId, dispatch, navigate, isLoading]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    dispatch(clearSession());
    dispatch(setSelectedParkingLotId(null));
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`${
        sidebarCollapsed 
          ? 'w-16' 
          : 'w-64'
      } transition-all duration-300 border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage your parking lots</p>
              </div>
            )}
            <button 
              onClick={() => dispatch(toggleSidebar())}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg 
                className={`w-5 h-5 text-neutral-600 dark:text-neutral-400 transition-transform duration-200 ${
                  sidebarCollapsed ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <ParkingLotSelector 
            lots={userLots} 
            isLoading={isLoading} 
            isError={isError}
            onRetry={refetch}
            collapsed={sidebarCollapsed}
          />
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <UserProfile 
            user={auth.user} 
            onLogout={handleLogout} 
            isLoggingOut={isLoggingOut}
            collapsed={sidebarCollapsed}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-neutral-50 dark:bg-neutral-900 overflow-auto">
        <div className="p-6">
          {/* Global Notifications */}
          {notification && (
            <div className={`mb-6 p-4 rounded-lg border ${
              notification.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}>
              <div className="flex items-center">
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
                <span className="font-medium">{notification.message}</span>
              </div>
            </div>
          )}
          
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function DashboardLayout() {
  return (
    <NotificationProvider>
      <DashboardContent />
    </NotificationProvider>
  );
}


