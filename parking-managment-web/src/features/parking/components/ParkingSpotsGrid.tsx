import { useMemo, useState } from 'react';
import type { SpotDTO } from '../types';

interface Props {
  spots: SpotDTO[];
  isLoading?: boolean;
  onSpotClick?: (spot: SpotDTO) => void;
}

export function ParkingSpotsGrid({ spots, isLoading = false, onSpotClick }: Props) {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');

  const floors = useMemo(() => {
    const floorSet = new Set(spots.map(spot => spot.floor));
    return Array.from(floorSet).sort((a, b) => a - b);
  }, [spots]);

  const filteredSpots = useMemo(() => {
    if (selectedFloor === 'all') return spots;
    return spots.filter(spot => spot.floor === selectedFloor);
  }, [spots, selectedFloor]);

  const spotsByFloor = useMemo(() => {
    const grouped = filteredSpots.reduce((acc, spot) => {
      if (!acc[spot.floor]) acc[spot.floor] = [];
      acc[spot.floor].push(spot);
      return acc;
    }, {} as Record<number, SpotDTO[]>);

    // Sort spots within each floor by code
    Object.keys(grouped).forEach(floor => {
      grouped[Number(floor)].sort((a, b) => a.code.localeCompare(b.code));
    });

    return grouped;
  }, [filteredSpots]);

  const getVehicleTypeIcon = (vehicleType: string) => {
    const type = vehicleType.toLowerCase();
    switch (type) {
      case 'car':
        return '🚗';
      case 'motorcycle':
        return '🏍️';
      case 'truck':
        return '🚛';
      case 'van':
        return '🚐';
      case 'electric':
        return '⚡';
      default:
        return '🚗';
    }
  };

  const getSpotStatusColor = (spot: SpotDTO) => {
    if (spot.isAvailable) {
      return 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    }
    return 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-40 animate-pulse" />
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!spots.length) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          No Parking Spots
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          This parking lot doesn't have any spots configured yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Floor selector and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Floor:</span>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Floors</option>
              {floors.map(floor => (
                <option key={floor} value={floor}>
                  Floor {floor}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 border-2 border-green-300 bg-green-50 dark:bg-green-900/20 rounded" />
            <span className="text-neutral-600 dark:text-neutral-400">Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 border-2 border-red-300 bg-red-50 dark:bg-red-900/20 rounded" />
            <span className="text-neutral-600 dark:text-neutral-400">Occupied</span>
          </div>
        </div>
      </div>

      {/* Spots grid by floor */}
      {Object.entries(spotsByFloor).map(([floor, floorSpots]) => (
        <div key={floor} className="space-y-4">
          {floors.length > 1 && selectedFloor === 'all' && (
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Floor {floor}
              </h3>
              <span className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full">
                {floorSpots.length} spots
              </span>
            </div>
          )}
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
            {floorSpots.map((spot) => (
              <SpotCard 
                key={spot.id} 
                spot={spot} 
                onClick={() => onSpotClick?.(spot)}
                icon={getVehicleTypeIcon(spot.vehicleType)}
                colorClass={getSpotStatusColor(spot)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface SpotCardProps {
  spot: SpotDTO;
  onClick?: () => void;
  icon: string;
  colorClass: string;
}

function SpotCard({ spot, onClick, icon, colorClass }: SpotCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative aspect-square p-2 border-2 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${colorClass}`}
      title={`${spot.code} - ${spot.vehicleType} - ${spot.isAvailable ? 'Available' : 'Occupied'}`}
    >
      {/* Vehicle type icon */}
      <div className="text-lg mb-1">{icon}</div>
      
      {/* Spot code */}
      <div className="text-xs font-medium truncate">{spot.code}</div>
      
      {/* Status indicator */}
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
        spot.isAvailable ? 'bg-green-500' : 'bg-red-500'
      }`} />
    </button>
  );
}
