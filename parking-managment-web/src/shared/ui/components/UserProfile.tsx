import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@shared/utils';
import { Button } from './Button';
import { extractUserRoles } from '@shared/utils/jwt';
import type { User } from '@shared/types';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { clearSession } from '@auth/slice/authSlice';
import { selectAuth } from '@auth/selectors';
import { authInitializationService } from '@auth/services/authInitializationService';

export interface UserProfileProps extends HTMLAttributes<HTMLDivElement> {
  user: User | null;
  isLoggingOut?: boolean;
  collapsed?: boolean;
}


const UserProfile = forwardRef<HTMLDivElement, UserProfileProps>(
  ({ className, user, isLoggingOut = false, collapsed = false, ...props }, ref) => {
    const dispatch = useAppDispatch();
    const { accessToken } = useAppSelector(selectAuth);

    const handleLogout = () => {
      authInitializationService.clearSession();
    }

    if (!user) return null;

    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    const fullName = `${user.firstName} ${user.lastName}`.trim();

    if (collapsed) {
      return (
        <div ref={ref} className={cn('flex flex-col items-center space-y-3', className)} {...props}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
            {initials}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            loading={isLoggingOut}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 rounded-lg"
            title={`Sign out ${fullName}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {fullName}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {user.email}
            </p>
            <p className="text-xs text-primary-600 dark:text-primary-400 capitalize font-medium">
              Manager
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          loading={isLoggingOut}
          className="w-full justify-start text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 rounded-lg"
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          }
        >
          Sign out
        </Button>
      </div>
    );
  }
);

UserProfile.displayName = 'UserProfile';
export { UserProfile };
