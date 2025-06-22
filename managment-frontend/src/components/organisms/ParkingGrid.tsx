import { useAppSelector } from '../../hooks/redux';
import type { Spot } from '../../types';

const ParkingGrid = () => {
  const { parkingLots, selectedParkingLot } = useAppSelector((state) => state.parkingLot);
  const { spots } = useAppSelector((state) => state.spot);

  const currentParkingLot = selectedParkingLot || parkingLots[0];
  const currentSpots = currentParkingLot 
    ? spots.filter(spot => spot.parking_lot_id === currentParkingLot.id)
    : [];

  if (!currentParkingLot) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No hay estacionamientos disponibles</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Grid de Estacionamiento
        </h2>
        <p className="text-gray-600">
          {currentParkingLot.address}
        </p>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {currentSpots.map((spot: Spot) => (
          <div
            key={spot.id}
            className={`
              p-3 rounded-lg border-2 text-center transition-colors duration-200
              ${spot.is_available 
                ? 'bg-green-100 border-green-300 hover:bg-green-200' 
                : 'bg-red-100 border-red-300'
              }
            `}
          >
            <div className="text-lg font-bold">
              {spot.code}
            </div>
            <div className="text-xs text-gray-600">
              {spot.vehicle_type}
            </div>
            <div className="text-xs">
              Piso {spot.floor}
            </div>
            <div className={`text-xs font-medium mt-1 ${
              spot.is_available ? 'text-green-700' : 'text-red-700'
            }`}>
              {spot.is_available ? 'Libre' : 'Ocupado'}
            </div>
          </div>
        ))}
      </div>

      {currentSpots.length === 0 && (
        <div className="text-center p-8">
          <p className="text-gray-500">No hay espacios registrados para este estacionamiento</p>
        </div>
      )}
    </div>
  );
};

export default ParkingGrid; 