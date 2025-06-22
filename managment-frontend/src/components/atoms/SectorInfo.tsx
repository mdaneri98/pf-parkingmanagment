interface SectorInfoProps {
  sector: string;
  spots: Array<{ vehicle_type: string; is_available: boolean }>;
}

const SectorInfo = ({ sector, spots }: SectorInfoProps) => {
  const vehicleTypes = [...new Set(spots.map(spot => spot.vehicle_type))];
  const availableSpots = spots.filter(spot => spot.is_available).length;
  const totalSpots = spots.length;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="font-semibold text-blue-900">
            Sector {sector}
          </h5>
          <p className="text-sm text-blue-700">
            {vehicleTypes.join(', ')} • {availableSpots}/{totalSpots} disponibles
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-900">
            {Math.round((availableSpots / totalSpots) * 100)}%
          </div>
          <div className="text-xs text-blue-600">disponibilidad</div>
        </div>
      </div>
    </div>
  );
};

export default SectorInfo; 