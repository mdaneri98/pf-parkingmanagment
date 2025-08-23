import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@shared/utils';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  lines?: number;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', lines = 1, ...props }, ref) => {
    if (variant === 'text') {
      return (
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'skeleton h-4',
                i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'skeleton',
          {
            'rounded-full': variant === 'circular',
            'rounded': variant === 'rectangular',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
