import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Card from '../components/atoms/Card';
import type { Spot } from '../types';
import ParkingGrid from '../components/organisms/ParkingGrid';
import { selectParkingLotByManagerId } from '../stores/parkingLotSlice';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { parkingLots, selectedParkingLot } = useAppSelector((state) => state.parkingLot);
  const { spots } = useAppSelector((state) => state.spot);

  const loggedInManagerId = 1;
  const managerParkingLot = parkingLots.find(lot => lot.manager_id === loggedInManagerId);

  useEffect(() => {
    if (managerParkingLot && !selectedParkingLot) {
      dispatch(selectParkingLotByManagerId(loggedInManagerId));
    }
  }, [dispatch, managerParkingLot, selectedParkingLot, loggedInManagerId]);

  const currentParkingLot = selectedParkingLot || managerParkingLot;
  const currentSpots = currentParkingLot 
    ? spots.filter(spot => spot.parking_lot_id === currentParkingLot.id)
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

  if (!managerParkingLot) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No hay estacionamiento asignado a este manager</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard - Mi Estacionamiento
        </h1>
        <p className="text-gray-600">
          {currentParkingLot ? `Gestión del estacionamiento en ${currentParkingLot.address}` : 'Cargando...'}
        </p>
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

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mi Estacionamiento</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary-50 border-2 border-primary-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Estacionamiento #{managerParkingLot.id}</p>
              <p className="text-sm text-gray-600">{managerParkingLot.address}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {stats.availableSpots}/{stats.totalSpots} disponibles
              </p>
              <p className="text-xs text-gray-500">
                {stats.totalSpots > 0 ? Math.round((stats.availableSpots / stats.totalSpots) * 100) : 0}% libre
              </p>
            </div>
          </div>
        </div>
      </Card>

      <ParkingGrid />
    </div>
  );
};

export default Dashboard; 