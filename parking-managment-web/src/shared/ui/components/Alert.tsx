import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@shared/utils';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant = 'info', 
    icon, 
    closable = false, 
    onClose, 
    children, 
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        'alert',
        {
          'alert-success': variant === 'success',
          'alert-warning': variant === 'warning',
          'alert-error': variant === 'error',
          'alert-info': variant === 'info',
        },
        className
      )}
      {...props}
    >
      <div className="flex items-start">
        {icon && (
          <div className="flex-shrink-0 mr-3">
            {icon}
          </div>
        )}
        <div className="flex-1">
          {children}
        </div>
        {closable && onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 -mr-1 -mt-1 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200"
            aria-label="Close alert"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
);

Alert.displayName = 'Alert';

const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn('font-medium mb-1', className)}
      {...props}
    />
  )
);

AlertTitle.displayName = 'AlertTitle';

const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm opacity-90', className)}
      {...props}
    />
  )
);

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
