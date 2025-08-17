import { PropsWithChildren } from 'react';

export function AuthCard({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>
      {children}
    </div>
  );
}


