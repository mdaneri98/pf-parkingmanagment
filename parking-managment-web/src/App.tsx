import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectAuth } from '@auth/selectors';
import { authInitializationService } from '@auth/services/authInitializationService';
import { router } from '@shared/routing/router';

function App() {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector(selectAuth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await authInitializationService.initializeFromStorage(dispatch);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isInitialized) {
      void initAuth();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, isInitialized]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-neutral-200 dark:border-neutral-700 rounded-full animate-spin border-t-primary-600"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-primary-400 opacity-20"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Initializing Parking Management
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Setting up your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
