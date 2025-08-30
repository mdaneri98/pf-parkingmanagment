import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@shared/utils';
import { Button } from './Button';

export interface UserProfileProps extends HTMLAttributes<HTMLDivElement> {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  } | null;
  onLogout: () => void;
  isLoggingOut?: boolean;
  collapsed?: boolean;
}

const UserProfile = forwardRef<HTMLDivElement, UserProfileProps>(
  ({ className, user, onLogout, isLoggingOut = false, collapsed = false, ...props }, ref) => {
    if (!user) {
      return null;
    }

    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    const fullName = `${user.firstName} ${user.lastName}`.trim();

    if (collapsed) {
      return (
        <div
          ref={ref}
          className={cn('flex flex-col items-center space-y-2', className)}
          {...props}
        >
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            loading={isLoggingOut}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
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
      <div
        ref={ref}
        className={cn(className)}
        {...props}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {initials}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {fullName}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {user.email}
            </p>
            {user.role && (
              <p className="text-xs text-primary-600 dark:text-primary-400 capitalize">
                {user.role}
              </p>
            )}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          loading={isLoggingOut}
          className="w-full justify-start text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
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
