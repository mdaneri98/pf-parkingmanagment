import React from 'react';
import { KpiCard } from './KpiCard';
import { BuildingIcon, CheckCircleIcon, LockIcon, ChartIcon } from '@parking/components/common/Icons';
import type { DashboardMetrics } from '@parking/types';

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard 
        title="Total Capacity" 
        value={metrics.totalSpots}
        icon={<BuildingIcon />}
        color="blue"
      />
      <KpiCard 
        title="Available Spots" 
        value={metrics.availableSpots}
        icon={<CheckCircleIcon />}
        color="green"
      />
      <KpiCard 
        title="Spots in Use" 
        value={metrics.occupiedSpots}
        icon={<LockIcon />}
        color="orange"
      />
      <KpiCard 
        title="Occupancy Rate" 
        value={`${metrics.occupancyRate}%`}
        icon={<ChartIcon />}
        color="purple"
        progress={metrics.occupancyRate}
      />
    </div>
  );
}