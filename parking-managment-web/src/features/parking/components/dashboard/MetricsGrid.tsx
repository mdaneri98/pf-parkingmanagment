import React from 'react';
import { KpiCard } from './KpiCard';
import { BuildingIcon, CheckCircleIcon, LockIcon, ChartIcon } from '@parking/components/common/Icons';
import type { DashboardMetrics } from '@parking/types';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const { t } = useTypedTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard 
        title={t('parking.metrics.totalSpots')}
        value={metrics.totalSpots}
        icon={<BuildingIcon />}
        color="blue"
      />
      <KpiCard 
        title={t('parking.metrics.availableSpots')}
        value={metrics.availableSpots}
        icon={<CheckCircleIcon />}
        color="green"
      />
      <KpiCard 
        title={t('parking.metrics.occupiedSpots')}
        value={metrics.occupiedSpots}
        icon={<LockIcon />}
        color="orange"
      />
      <KpiCard 
        title={t('parking.metrics.occupancyRate')}
        value={`${metrics.occupancyRate}%`}
        icon={<ChartIcon />}
        color="purple"
        progress={metrics.occupancyRate}
      />
    </div>
  );
}