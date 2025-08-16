import { Link, useLocation, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import type { User } from '../types';

const AppLayout: React.FC = () => {
  const location = useLocation();
  
  // Mock user data - in the future will come from authentication state
  const currentUser: User = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@gmail.com',
    password_hash: '',
    image_url: 'https://i.pravatar.cc/150?img=1',
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Users', href: '/users', icon: '👥' },
    { name: 'Parking Lots', href: '/parking-lots', icon: '🅿️' },
    { name: 'Spots', href: '/spots', icon: '🚗' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex-shrink-0 px-4 py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🅿️</span>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">
                  Parking Manager
                </h1>
                <p className="text-sm text-gray-600">Control Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive 
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Manager Info */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {currentUser.image_url ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={currentUser.image_url}
                    alt={`${currentUser.first_name} ${currentUser.last_name}`}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser.first_name.charAt(0)}
                      {currentUser.last_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser.first_name} {currentUser.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
