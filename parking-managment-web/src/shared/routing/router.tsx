import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '../../templates/AuthLayout';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { RequestRecoveryPage } from '../../features/auth/pages/RequestRecoveryPage';
import { VerifyTokenPage } from '../../features/auth/pages/VerifyTokenPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';
import { ProtectedRoute } from '../routing/ProtectedRoute';
import { DashboardLayout } from '../../templates/DashboardLayout';
import { DashboardPage } from '../../features/parking/pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: '/', element: <LoginPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/password-recovery', element: <RequestRecoveryPage /> },
      { path: '/password-recovery/verify', element: <VerifyTokenPage /> },
      { path: '/password-recovery/reset', element: <ResetPasswordPage /> },
    ],
  },
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <DashboardLayout />,
        children: [
          { path: '/app/:lotId', element: <DashboardPage /> },
        ],
      },
    ],
  },
]);


