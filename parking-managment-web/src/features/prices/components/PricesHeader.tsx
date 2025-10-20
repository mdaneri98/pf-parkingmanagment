import React from 'react';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface PricesHeaderProps {
  lotName: string;
  lotAddress?: string;
}

export function PricesHeader({ 
  lotName, 
  lotAddress 
}: PricesHeaderProps) {
  const { t } = useTypedTranslation();
  
  return (
    <div className="mb-8">
      <div className="space-y-2">
        <h1 className="page-title">
          {t('prices.header', { lotName })}
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
