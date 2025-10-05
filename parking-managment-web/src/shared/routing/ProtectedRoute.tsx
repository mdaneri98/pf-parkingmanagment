import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectAuth } from '../../features/auth/selectors';
import { extractUserRoles } from '../utils/jwt';

export function ProtectedRoute() {
  const { isAuthenticated, user, accessToken, isInitialized } = useAppSelector(selectAuth);

  // If not authenticated, redirect to login
  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-neutral-200 dark:border-neutral-700 rounded-full animate-spin border-t-primary-600"></div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has manager role from JWT token
  const userRoles = accessToken ? extractUserRoles(accessToken) : [];
  const hasManagerRole = userRoles.some(role => role.toLowerCase() === 'manager');
  
  if (!hasManagerRole) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}


