import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ParkingLotResponse } from '../types';

interface Props {
  lots: ParkingLotResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function ParkingLotSelector({ lots, isLoading, isError }: Props) {
  const navigate = useNavigate();
  const params = useParams();
  const activeId = params.lotId ? Number(params.lotId) : null;

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      );
    }
    if (isError) {
      return <div className="text-red-600 text-sm">Failed to load parking lots.</div>;
    }
    if (!lots.length) {
      return <div className="text-gray-500 text-sm">No assigned parking lots.</div>;
    }
    return (
      <ul className="space-y-1">
        {lots.map((lot) => (
          <li key={lot.id}>
            <button
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                activeId === lot.id ? 'bg-gray-100 font-medium' : ''
              }`}
              onClick={() => navigate(`/app/${lot.id}`)}
            >
              <div className="text-sm">{lot.name}</div>
              <div className="text-xs text-gray-500">{lot.address}</div>
            </button>
          </li>
        ))}
      </ul>
    );
  }, [isLoading, isError, lots, activeId, navigate]);

  return (
    <div>
      <div className="mb-2 text-sm font-medium">Your Parking Lots</div>
      {content}
    </div>
  );
}


