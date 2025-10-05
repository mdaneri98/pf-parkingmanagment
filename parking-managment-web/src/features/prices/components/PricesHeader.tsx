import React from 'react';

interface PricesHeaderProps {
  lotName: string;
  lotAddress?: string;
}

export function PricesHeader({ 
  lotName, 
  lotAddress 
}: PricesHeaderProps) {
  return (
    <div className="mb-8">
      <div className="space-y-2">
        <h1 className="page-title">
          {lotName} - Price Management
        </h1>
        {lotAddress && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {lotAddress}
          </p>
        )}
      </div>
    </div>
  );
}
