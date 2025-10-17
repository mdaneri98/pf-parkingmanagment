import { Outlet } from 'react-router-dom';
import { NotificationProvider, useNotification } from '@shared/contexts/NotificationContext';
import { GlobalNotifications } from '@shared/layout/GlobalNotifications';

function AuthContent() {
  const { notification } = useNotification();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <GlobalNotifications notification={notification} />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Parking Management
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Efficient parking solutions for modern cities
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export function AuthLayout() {
  return (
    <NotificationProvider>
      <AuthContent />
    </NotificationProvider>
  );
}


