import { NavLink } from 'react-router-dom';
import { ParkingLotSelector } from '../../features/parking/components/lots/ParkingLotSelector';
import { UserProfile } from '@shared/ui/components/UserProfile';
import { SidebarHeader } from './SidebarHeader';
import { useAppSelector } from '@hooks/useAppSelector';
import { 
  selectParkingLots,
  selectSelectedParkingLotId,
  selectParkingLotsLoading,
  selectParkingLotsError
} from '@parking/selectors/parkingLotSelectors';

export interface AppSidebarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  user: any;
}

interface NavigationItem {
  name: string;
  path: string | ((lotId: number | null) => string);
  icon: React.ReactNode;
  requiresLot?: boolean;
  badge?: string;
  description?: string;
}

export function AppSidebar({
  sidebarCollapsed,
  onToggleSidebar,
  user
}: AppSidebarProps) {
  const managerLots = useAppSelector(selectParkingLots);
  const selectedLotId = useAppSelector(selectSelectedParkingLotId);
  const isLoading = useAppSelector(selectParkingLotsLoading);
  const isError = useAppSelector(selectParkingLotsError);

  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      path: (lotId) => lotId ? `/app/dashboard/${lotId}` : '/app/dashboard/select-lot',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14l-5-3-5 3V5z" />
        </svg>
      ),
      requiresLot: true,
      description: '',
    },
    {
      name: 'Prices',
      path: (lotId) => lotId ? `/app/prices/${lotId}` : '/app/dashboard/select-lot',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      requiresLot: true,
      description: '',
      badge: '',
    },
    {
      name: 'Settings',
      path: (lotId) => lotId ? `/app/settings/${lotId}` : '/app/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      requiresLot: false,
      description: '',
    },
  ];

  const getNavigationPath = (item: NavigationItem): string => {
    if (typeof item.path === 'function') {
      return item.path(selectedLotId);
    }
    return item.path;
  };

  const renderNavigationItem = (item: NavigationItem, isCollapsed: boolean = false) => {
    const path = getNavigationPath(item);
    
    const content = (
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
        <span className={`text-lg ${isCollapsed ? '' : 'mr-3'}`}>
          {item.icon}
        </span>
        {!isCollapsed && (
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">{item.name}</span>
              {item.badge && (
                <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {item.description}
              </p>
            )}
          </div>
        )}
      </div>
    );

    return (
      <NavLink
        key={item.name}
        to={path}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
            isActive
              ? 'bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20 text-primary-700 dark:text-primary-300 shadow-sm border border-primary-200/50 dark:border-primary-700/50'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/80 dark:hover:bg-neutral-700/80 hover:text-neutral-900 dark:hover:text-neutral-100 hover:shadow-sm'
          } ${isCollapsed ? 'justify-center' : ''}`
        }
        title={isCollapsed ? item.name : undefined}
      >
        {content}
      </NavLink>
    );
  };

  return (
    <aside className={`${
      sidebarCollapsed ? 'w-16' : 'w-72'
    } transition-all duration-300 border-r border-neutral-200/50 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md flex flex-col shadow-elevation-medium`}>
      
      <SidebarHeader 
        collapsed={sidebarCollapsed} 
        onToggle={onToggleSidebar} 
      />
      
      {/* Main Navigation */}
      <nav className={`${sidebarCollapsed ? 'px-2' : 'px-4'} py-3 border-b border-neutral-200/30 dark:border-neutral-700/30`}>
        <div className="space-y-1">
          {navigationItems.map((item) => renderNavigationItem(item, sidebarCollapsed))}
        </div>
      </nav>

      {/* Parking Lot Selector */}
      <div className="flex-1 p-4 overflow-y-auto">
        <ParkingLotSelector 
          collapsed={sidebarCollapsed}
        />
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-neutral-200/50 dark:border-neutral-700/50 bg-gradient-to-r from-neutral-50/50 to-transparent dark:from-neutral-800/50">
        <UserProfile 
          user={user} 
          collapsed={sidebarCollapsed}
        />
      </div>
    </aside>
  );
}
