import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ParkingLotResponse } from '../types';

interface Props {
  lots: ParkingLotResponse[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => unknown;
  collapsed?: boolean;
}

export function ParkingLotSelector({ lots, isLoading, isError, onRetry, collapsed = false }: Props) {
  const navigate = useNavigate();
  const params = useParams();
  const activeId = params.lotId ? Number(params.lotId) : null;

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
      );
    }
    if (isError) {
      return (
        <div className={`p-3 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg ${
          collapsed ? 'text-center' : ''
        }`}>
          {!collapsed && (
            <div className="text-red-700 dark:text-red-300 text-sm font-medium mb-2">
              Failed to load parking lots
            </div>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className={`${
                collapsed 
                  ? 'p-2 w-full' 
                  : 'px-2 py-1'
              } text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200`}
              title={collapsed ? 'Retry loading parking lots' : undefined}
            >
              {collapsed ? '⟳' : 'Retry'}
            </button>
          )}
        </div>
      );
    }
    if (!lots.length) {
      return (
        <div className={`p-3 text-neutral-500 dark:text-neutral-400 text-sm ${
          collapsed ? 'text-center' : ''
        }`}>
          {collapsed ? '!' : 'No assigned parking lots.'}
        </div>
      );
    }
    return (
      <ul className="space-y-1">
        {lots.map((lot) => (
          <li key={lot.id}>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                activeId === lot.id 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-medium border border-blue-200 dark:border-blue-800' 
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
              } ${collapsed ? 'text-center' : ''}`}
              onClick={() => navigate(`/app/${lot.id}`)}
              title={collapsed ? `${lot.name} - ${lot.address}` : undefined}
            >
              {collapsed ? (
                <div className="text-sm font-semibold">
                  {lot.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <>
                  <div className="text-sm">{lot.name}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{lot.address}</div>
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
    );
  }, [isLoading, isError, lots, activeId, navigate, collapsed, onRetry]);

  return (
    <div>
      {!collapsed && (
        <div className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Your Parking Lots
        </div>
      )}
      {content}
    </div>
  );
}


