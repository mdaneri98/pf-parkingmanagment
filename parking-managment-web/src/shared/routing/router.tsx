import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../../templates/AuthLayout';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { RequestRecoveryPage } from '../../features/auth/pages/RequestRecoveryPage';
import { VerifyTokenPage } from '../../features/auth/pages/VerifyTokenPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../../templates/DashboardLayout';
import { DashboardPage } from '../../features/parking/pages/DashboardPage';

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
      { path: 'password-recovery/verify', element: <VerifyTokenPage /> },
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
        element: <DashboardLayout />,
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
          { path: ':lotId', element: <DashboardPage /> },
        ],
      },
    ],
  },
]);


