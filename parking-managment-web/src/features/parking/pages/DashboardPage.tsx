import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGetParkingLotByIdQuery } from '../api/parkingApi';

export function DashboardPage() {
  const params = useParams();
  const lotId = params.lotId ? Number(params.lotId) : NaN;
  const { data, isLoading, isError, refetch } = useGetParkingLotByIdQuery(lotId, {
    pollingInterval: 5000,
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
    return <div className="text-sm text-gray-600">Select a parking lot to view its dashboard.</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded">
        <div className="text-red-700 font-medium mb-2">Failed to load dashboard.</div>
        <button className="px-3 py-1 text-sm bg-red-600 text-white rounded" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  const lotName = data?.data?.name ?? `Lot ${lotId}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{lotName}</h2>
        <p className="text-sm text-gray-500">Live overview updates every 5s</p>
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
    <div className="p-4 border rounded bg-white">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}


