import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectAuth } from './features/auth/selectors';
import { setCredentials, setInitialized } from './features/auth/slice/authSlice';
import { validateStoredTokens } from './shared/utils/jwt';
import { initializeUserSession } from './shared/utils/authUtils';
import { router } from './shared/routing/router';

function App() {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector(selectAuth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored tokens
        const validation = validateStoredTokens();
        
        if (validation.isValid && validation.accessToken && validation.refreshToken) {
          // Set credentials in Redux
          dispatch(setCredentials({
            accessToken: validation.accessToken,
            refreshToken: validation.refreshToken
          }));

          // Initialize user session
          const tokenPayload = JSON.parse(atob(validation.accessToken.split('.')[1]));
          if (tokenPayload?.sub) {
            await initializeUserSession(
              validation.accessToken,
              validation.refreshToken,
              tokenPayload.sub
            );
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        dispatch(setInitialized(true));
        setIsLoading(false);
      }
    };

    if (!isInitialized) {
      initializeAuth();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, isInitialized]);

  // Show loading screen until auth is initialized
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
