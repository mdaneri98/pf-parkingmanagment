import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectAuth } from '../../features/auth/selectors';

export function ProtectedRoute() {
  const { isAuthenticated, user } = useAppSelector(selectAuth);

  // Simple check: redirect if not authenticated or invalid role
  if (!isAuthenticated || !user || user.role !== 'manager') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}


