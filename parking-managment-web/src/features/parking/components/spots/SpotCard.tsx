import { memo } from 'react';
import type { SpotDTO } from '@parking/types';
import type { VehicleType } from '@shared/constants';
import { ParkingService } from '@parking/services/parkingService';

interface SpotCardProps {
  spot: SpotDTO;
  onClick?: () => void;
}

function SpotCardComponent({ spot, onClick }: SpotCardProps) {
  const icon = ParkingService.getVehicleIcon(spot.vehicleType as VehicleType);
  const colorClass = ParkingService.getSpotStatusClasses(spot.isAvailable);

  return (
    <button
      onClick={onClick}
      className={`relative aspect-square p-3 border-2 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 group ${colorClass}`}
      title={`${spot.code} - ${spot.vehicleType} - ${spot.isAvailable ? 'Available' : 'Occupied'}`}
      aria-label={`Parking spot ${spot.code}, ${spot.vehicleType}, ${spot.isAvailable ? 'Available' : 'Occupied'}`}
    >
      {/* Vehicle type icon */}
      <div className="text-xl mb-2 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">{icon}</div>
      
      {/* Spot code */}
      <div className="text-xs font-semibold truncate">{spot.code}</div>
      
      {/* Status indicator */}
      <div 
        className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-800 shadow-sm ${
          spot.isAvailable ? 'bg-success-500 shadow-glow-success' : 'bg-error-500 shadow-glow-error'
        }`} 
        aria-hidden="true"
      />
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>
  );
}

export const SpotCard = memo(SpotCardComponent);