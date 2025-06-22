import type { Spot } from '../../types';

interface SlotCardProps {
  spot: Spot;
  onClick: (spot: Spot) => void;
}

const SlotCard = ({ spot, onClick }: SlotCardProps) => {
  const getVehicleTypeColor = (vehicleType: string) => {
    const colors: Record<string, string> = {
      'Car': 'bg-blue-100 border-blue-300 text-blue-800',
      'Motorcycle': 'bg-purple-100 border-purple-300 text-purple-800',
      'Truck': 'bg-orange-100 border-orange-300 text-orange-800',
      'Van': 'bg-indigo-100 border-indigo-300 text-indigo-800'
    };
    return colors[vehicleType] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const getVehicleTypeIcon = (vehicleType: string) => {
    const icons: Record<string, string> = {
      'Car': '🚗',
      'Motorcycle': '🏍️',
      'Truck': '🚛',
      'Van': '🚐'
    };
    return icons[vehicleType] || '🚙';
  };

  return (
    <div
      className={`
        p-3 rounded-lg border-2 text-center cursor-pointer transition-all duration-200 hover:scale-105
        ${spot.is_available 
          ? 'bg-green-100 border-green-300 hover:bg-green-200 hover:border-green-400' 
          : 'bg-red-100 border-red-300 hover:bg-red-200 hover:border-red-400'
        }
      `}
      onClick={() => onClick(spot)}
    >
      <div className="text-lg font-bold mb-1">
        {spot.code}
      </div>
      
      <div className="text-2xl mb-2">
        {getVehicleTypeIcon(spot.vehicle_type)}
      </div>
      
      <div className={`text-xs px-2 py-1 rounded-full ${getVehicleTypeColor(spot.vehicle_type)}`}>
        {spot.vehicle_type}
      </div>
      
      <div className={`text-xs font-medium mt-2 ${
        spot.is_available ? 'text-green-700' : 'text-red-700'
      }`} />
      
    </div>
  );
};

export default SlotCard;
