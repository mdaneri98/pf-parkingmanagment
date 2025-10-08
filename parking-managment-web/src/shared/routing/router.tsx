import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../../templates/AuthLayout';
import { LoginPage } from '@auth/pages/LoginPage';
import { RegisterPage } from '@auth/pages/RegisterPage';
import { RequestRecoveryPage } from '@auth/pages/RequestRecoveryPage';
import { ResetPasswordPage } from '@auth/pages/ResetPasswordPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@shared/layout';
import { DashboardPage, SettingsPage, WelcomePage } from '@parking/pages';
import { PricesPage } from '@prices/pages/PricesPage';
import { ReservationsPage } from '../../features/reservations/pages/ReservationsPage';

export const router = createBrowserRouter([
  // Root redirect to app for authenticated users, login for others
  {
    path: '/',
    element: <Navigate to="/app" replace />,
  },
  
  // Public auth routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'password-recovery', element: <RequestRecoveryPage /> },
      { path: 'password-recovery/reset', element: <ResetPasswordPage /> },
    ],
  },
  
  // Protected app routes
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          { 
            index: true, 
            element: <Navigate to="/app/select-lot" replace /> 
          },
          { 
            path: 'select-lot', 
            element: <div className="p-4 text-center text-gray-600">
              <h2 className="text-lg font-semibold mb-2">Select a Parking Lot</h2>
              <p className="text-sm">Choose a parking lot from the sidebar to view its dashboard.</p>
            </div> 
          },
          {
            path: 'welcome',
            element: <WelcomePage />
          },
          // Lot-specific routes
          { path: 'dashboard/:lotId', element: <DashboardPage /> },
          { path: 'prices/:lotId', element: <PricesPage /> },
          { path: 'settings/:lotId', element: <SettingsPage /> },
          { path: 'reservations/:lotId', element: <ReservationsPage />,},

          // Global routes (don't require lot selection)
          { path: 'settings', element: <SettingsPage /> },
          {
            path: 'analytics',
            element: <div className="p-4 text-center text-gray-600">
              <h2 className="text-lg font-semibold mb-2">Analytics</h2>
              <p className="text-sm">Analytics feature coming soon...</p>
            </div>
          },
          {
            path: 'analytics/:lotId',
            element: <div className="p-4 text-center text-gray-600">
              <h2 className="text-lg font-semibold mb-2">Analytics</h2>
              <p className="text-sm">Analytics feature coming soon...</p>
            </div>
          },
        ],
      },
    ],
  },
]);


