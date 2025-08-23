import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGetParkingLotByIdQuery } from '../api/parkingApi';
import { config } from '../../../shared/config/env';

export function DashboardPage() {
  const params = useParams();
  const lotId = params.lotId ? Number(params.lotId) : NaN;
  const { data, isLoading, isError, refetch } = useGetParkingLotByIdQuery(lotId, {
    pollingInterval: config.polling.dashboardInterval,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: isNaN(lotId),
  });

  const metrics = useMemo(() => {
    const lot = data?.data;
    const capacity = lot?.spots?.length ?? 0;
    const available = lot?.spots?.filter((s) => s.isAvailable).length ?? 0;
    const inUse = capacity - available;
    const occupancy = capacity > 0 ? Math.round((inUse / capacity) * 100) : 0;
    return { capacity, available, inUse, occupancy };
  }, [data]);

  if (isNaN(lotId)) {
    return <div className="text-sm text-neutral-600 dark:text-neutral-400">Select a parking lot to view its dashboard.</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 border border-error-200 bg-error-50 dark:bg-error-900/20 dark:border-error-800 rounded">
        <div className="text-error-700 dark:text-error-300 font-medium mb-2">Failed to load dashboard.</div>
        <button className="px-3 py-1 text-sm bg-error-600 hover:bg-error-700 text-white rounded transition-colors duration-200" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  const lotName = data?.data?.name ?? `Lot ${lotId}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{lotName}</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Live overview updates every {Math.round(config.polling.dashboardInterval / 1000)}s</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Capacity" value={metrics.capacity} />
        <KpiCard title="Available" value={metrics.available} />
        <KpiCard title="In Use" value={metrics.inUse} />
        <KpiCard title="Occupancy" value={`${metrics.occupancy}%`} />
      </div>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 shadow-sm">
      <div className="text-sm text-neutral-500 dark:text-neutral-400">{title}</div>
      <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{value}</div>
    </div>
  );
}


