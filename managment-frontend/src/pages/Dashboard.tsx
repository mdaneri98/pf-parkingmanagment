import { mockParkingLots, mockSpots } from '../utils/mockData';
import Card from '../components/atoms/Card';
import type { ParkingLot, Spot } from '../types';
import ParkingGrid from '../components/organisms/ParkingGrid';

const Dashboard = () => {
  // Usar directamente los datos mockeados
  const parkingLots = mockParkingLots;
  const spots = mockSpots;

  // Calcular estadísticas basadas en los datos mockeados
  const stats = {
    totalParkingLots: parkingLots.length,
    totalSpots: spots.length,
    availableSpots: spots.filter((spot: Spot) => spot.is_available).length,
    occupiedSpots: spots.filter((spot: Spot) => !spot.is_available).length,
    occupancyPercentage: spots.length > 0 
      ? Math.round(((spots.filter((spot: Spot) => !spot.is_available).length) / spots.length) * 100)
      : 0
  };

  // Obtener el primer estacionamiento como ejemplo
  const firstParkingLot = parkingLots[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard - Gestión de Estacionamientos
        </h1>
        <p className="text-gray-600">
          {firstParkingLot ? `Gestión del estacionamiento en ${firstParkingLot.address}` : 'Sistema de gestión de estacionamientos'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🏢</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Estacionamientos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalParkingLots}</p>
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

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Porcentaje de Ocupación</p>
              <p className="text-3xl font-bold text-orange-600">{stats.occupancyPercentage}%</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eficiencia del Sistema</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalSpots > 0 ? Math.round((stats.availableSpots / stats.totalSpots) * 100) : 0}%
              </p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </Card>
      </div>

      {/* Parking Lots List */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Estacionamientos Registrados</h2>
        <div className="space-y-3">
          {parkingLots.map((lot: ParkingLot) => {
            const lotSpots = spots.filter((spot: Spot) => spot.parking_lot_id === lot.id);
            const availableCount = lotSpots.filter((spot: Spot) => spot.is_available).length;
            const totalCount = lotSpots.length;
            
            return (
              <div key={lot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Estacionamiento #{lot.id}</p>
                  <p className="text-sm text-gray-600">{lot.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {availableCount}/{totalCount} disponibles
                  </p>
                  <p className="text-xs text-gray-500">
                    {totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0}% libre
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Parking Grid */}
      <ParkingGrid />
    </div>
  );
};

export default Dashboard; 