import React from 'react';

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
  progress?: number;
}

export function KpiCard({ title, value, icon, color, progress }: KpiCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
  };

  return (
    <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {title}
        </p>
        <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          {value}
        </p>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                progress >= 80 ? 'bg-red-500' : 
                progress >= 60 ? 'bg-orange-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}