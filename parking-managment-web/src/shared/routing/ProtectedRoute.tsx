import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectAuth, selectIsAuthenticated } from '../../features/auth/selectors';

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { user } = useAppSelector(selectAuth);

  if (!isAuthenticated || !user || user.role !== 'manager') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}


