import { useAppSelector } from '../hooks/redux';
import Card from '../components/atoms/Card';
import type { Spot } from '../types';
import ParkingGrid from '../components/organisms/ParkingGrid';

const Dashboard = () => {
  const { selectedParkingLot } = useAppSelector((state) => state.parkingLot);
  const { spots } = useAppSelector((state) => state.spot);

  const currentSpots = selectedParkingLot 
    ? spots.filter(spot => spot.parking_lot_id === selectedParkingLot.id)
    : [];

  const stats = {
    totalParkingLots: 1,
    totalSpots: currentSpots.length,
    availableSpots: currentSpots.filter((spot: Spot) => spot.is_available).length,
    occupiedSpots: currentSpots.filter((spot: Spot) => !spot.is_available).length,
    occupancyPercentage: currentSpots.length > 0 
      ? Math.round(((currentSpots.filter((spot: Spot) => !spot.is_available).length) / currentSpots.length) * 100)
      : 0
  };

  if (!selectedParkingLot) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Cargando estacionamiento...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Direccion</p>
              <p className="text-3xl font-bold text-blue-400">
                {selectedParkingLot.address}
              </p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Porcentaje de Ocupación</p>
              <p className="text-3xl font-bold text-orange-400">{stats.occupancyPercentage}%</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🏢</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mi Estacionamiento</p>
              <p className="text-2xl font-semibold text-gray-900">1</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">🅿️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Espacios</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalSpots}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-semibold text-green-600">{stats.availableSpots}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">🚗</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ocupados</p>
              <p className="text-2xl font-semibold text-red-600">{stats.occupiedSpots}</p>
            </div>
          </div>
        </Card>
      </div>

      <ParkingGrid />
    </div>
  );
};

export default Dashboard; 